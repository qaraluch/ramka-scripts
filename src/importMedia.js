const { initLogger, initProgressBarBasic } = require("./logger");
const {
  walkInputDir,
  limitImportMedia,
  readMetadataHash,
  readMetadataExif,
  copyMediaToRamka,
  calculateOutputPaths,
  filterOutCopyFailed,
  listImportedDupPaths
} = require("./fs");
const {
  putNewMediaToDB,
  prepareDBRecord,
  pullAllHashesDB,
  filterConfirmationFailed
} = require("./db");
const {
  findDuplicatesInInportedFiles,
  findDuplicatesInDB
} = require("./dedupe.js");

async function importMedia(options) {
  const { loggerOptions } = options;
  const { log, logFile } = await initLogger({ loggerOptions });
  log.welcome();
  try {
    log.readFilesIn(options.mediaImportDir);
    const fileListAll = await walkInputDir(options.mediaImportDir);
    const fileList = limitImportMedia(fileListAll, options.limitImport);
    const inputCount = fileList.length;
    logWalkedFiles(inputCount, fileList, log, logFile);

    log.it("About to calculate hash of files...");
    log.time("[ hashing ]");
    const logHashProgressBar = initProgressBarBasic({
      total: fileList.length,
      msg: "hashing"
    });
    const fileList_extraInfoHash = await readMetadataHash(
      fileList,
      logHashProgressBar
    );
    if (logHashProgressBar.complete) {
      log.timeEnd("[ hashing ]");
      log.it("Finished hash calculating");
    }

    let dbAllHashes;
    if (options.dryRunDBPut) {
      dbAllHashes = [];
    } else {
      dbAllHashes = await pullAllHashesDB(options.dbName);
      log.it("Pulled hashes from data base to compare");
    }

    const [fileList_dbUniq, fileList_dbDups] = findDuplicatesInDB(
      fileList_extraInfoHash,
      dbAllHashes
    );
    logDbDuplicates(fileList_dbDups, options.disableFileLogs, log, logFile);

    const [fileList_extraInfoExif, fileList_exifError] = await readMetadataExif(
      fileList_dbUniq
    );
    logExifErrors(fileList_exifError, options.disableFileLogs, log, logFile);

    const [fileList_outputPaths, noDateFilesList] = calculateOutputPaths(
      fileList_extraInfoExif,
      options.mediaRepoDir,
      options.ramkaHomeDir
    );
    logFilesWithNoDate(noDateFilesList, options.disableFileLogs, log, logFile);

    const [
      fileList_importUniq,
      fileList_importDups
    ] = findDuplicatesInInportedFiles(fileList_outputPaths);

    const fileList_importDupsPaths = listImportedDupPaths(
      fileList_importUniq,
      fileList_importDups
    );
    logImportDuplicates(
      fileList_importDupsPaths,
      options.disableFileLogs,
      log,
      logFile
    );

    let copyMediaResults;
    if (options.dryRunCopyMedia) {
      copyMediaResults = fileList_importUniq.map(() => [
        false,
        true,
        false,
        true
      ]);
    } else {
      log.it("About to copy of files to the ramka...");
      log.time("[ copy ]");
      const logCopyProgressBar = initProgressBarBasic({
        total: fileList_importUniq.length,
        msg: "copy"
      });
      copyMediaResults = await copyMediaToRamka(
        fileList_importUniq,
        logCopyProgressBar
      );
      if (logHashProgressBar.complete) {
        log.timeEnd("[ copy ]");
        log.it("Finished copy of media files");
      }
    }
    const [fileList_copyGood, fileList_copyFailed] = filterOutCopyFailed(
      fileList_importUniq,
      copyMediaResults
    );
    logCopyFailed(fileList_copyFailed, options.disableFileLogs, log, logFile);

    const mediaListForDB = prepareDBRecord(fileList_copyGood);

    let confirmations;
    let confirmationsFailed;
    if (options.dryRunDBPut) {
      confirmations = [];
      confirmationsFailed = [];
    } else {
      confirmations = await putNewMediaToDB(mediaListForDB, options.dbName);
      confirmationsFailed = filterConfirmationFailed(confirmations);
      // TODO: implement+test when edge case occurs
    }
    logConfirmationFailed(
      confirmationsFailed,
      options.disableFileLogs,
      log,
      logFile
    );
    const outputCount = confirmations.length;
    log.importedFilesCount(outputCount);

    const result = {
      inputCount,
      outputCount,
      fileListExifError: fileList_exifError,
      fileListDuplicatesImport: fileList_importDups,
      fileListDuplicatesImportPaths: fileList_importDupsPaths,
      fileListDuplicatesDB: fileList_dbDups,
      fileListNoDates: noDateFilesList,
      fileListCopyFailed: fileList_copyFailed,
      confirmations,
      confirmationsFailed
    };
    log.done();
    return result;
  } catch (error) {
    throw new Error(`importMedia.js - Sth. went wrong: ...\n ${error.stack}`);
  }
}

function logDbDuplicates(dbDuplicates, disableFileLogs, log, logFile) {
  if (!disableFileLogs && dbDuplicates.length > 0) {
    log.foundDbDuplicates(dbDuplicates.length);
    logFile.it("List of duplicates found in DB", "db-duplicates", dbDuplicates);
  }
}

function logExifErrors(exifErrors, disableFileLogs, log, logFile) {
  if (!disableFileLogs && exifErrors.length > 0) {
    log.foundExifErrors(exifErrors.length);
    logFile.it("List of read exif errors", "exif-errors", exifErrors);
  }
}

function logFilesWithNoDate(noDateFiles, disableFileLogs, log, logFile) {
  if (!disableFileLogs && noDateFiles.length > 0) {
    log.foundNoDateFiles(noDateFiles.length);
    logFile.it(
      "List of files with no date in the name",
      "no-date-files",
      noDateFiles
    );
  }
}

function logImportDuplicates(importDuplicates, disableFileLogs, log, logFile) {
  if (!disableFileLogs && importDuplicates.length > 0) {
    log.foundImportDuplicates(importDuplicates.length);
    logFile.it(
      "List of duplicate files in import dir",
      "import-duplicates",
      importDuplicates
    );
  }
}

function logCopyFailed(copyFailed, disableFileLogs, log, logFile) {
  if (!disableFileLogs && copyFailed.length > 0) {
    log.foundCopyFailed(copyFailed.length);
    logFile.it("List of failed copy files", "copy-failed", copyFailed);
  }
}

function logConfirmationFailed(
  confirmationsFailed,
  disableFileLogs,
  log,
  logFile
) {
  if (!disableFileLogs && confirmationsFailed.length > 0) {
    log.foundDBPutFaild(confirmationsFailed.length);
    logFile.it(
      "List database put failures",
      "db-confirmation-failed",
      confirmationsFailed
    );
  }
}

function logWalkedFiles(inputCount, fileList, log, logFile) {
  const fileListImportedPath = fileList.map(itm => itm.importedPath);
  log.readFilesCount(inputCount);
  logFile.it("List of walked files", "walked-files", fileListImportedPath);
}

module.exports = {
  importMedia
};
