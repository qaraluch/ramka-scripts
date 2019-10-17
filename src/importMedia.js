const {
  walkInputDir,
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
  try {
    const fileList = await walkInputDir(options.mediaImportDir);
    const inputCount = fileList.length;

    const fileList_extraInfoHash = await readMetadataHash(fileList);

    const dbAllHashes = await pullAllHashesDB(options.dbName);

    const [fileList_dbUniq, fileList_dbDups] = findDuplicatesInDB(
      fileList_extraInfoHash,
      dbAllHashes
    );

    const [fileList_extraInfoExif, fileList_exifError] = await readMetadataExif(
      fileList_dbUniq
    );

    const [fileList_outputPaths, noDateFilesList] = calculateOutputPaths(
      fileList_extraInfoExif,
      options.mediaRepoDir,
      options.ramkaHomeDir
    );

    const [
      fileList_importUniq,
      fileList_importDups
    ] = findDuplicatesInInportedFiles(fileList_outputPaths);

    const fileList_importDupsPaths = listImportedDupPaths(
      fileList_importUniq,
      fileList_importDups
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
      copyMediaResults = await copyMediaToRamka(fileList_importUniq);
    }
    const [fileList_copyGood, fileList_copyFailed] = filterOutCopyFailed(
      fileList_importUniq,
      copyMediaResults
    );

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
    const outputCount = confirmations.length;

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
    return result;
  } catch (error) {
    throw new Error(`importMedia.js - Sth. went wrong: ...\n ${error.stack}`);
  }
}

module.exports = {
  importMedia
};
