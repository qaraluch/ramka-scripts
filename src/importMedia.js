const {
  walkInputDir,
  readExtraMetadataInfo,
  copyMediaToRamka,
  calculateOutputPaths,
  filterOutCopyFailed
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
    const filesList = await walkInputDir(options.mediaImportDir);
    const inputCount = filesList.length;

    const [
      filesList_extraInfo,
      filesList_exifError
    ] = await readExtraMetadataInfo(filesList);

    const [filesList_outputPaths, noDateFilesList] = calculateOutputPaths(
      filesList_extraInfo,
      options.mediaRepoDir,
      options.ramkaHomeDir
    );

    const [
      filesList_importUniq,
      filesList_importDups
    ] = findDuplicatesInInportedFiles(filesList_outputPaths);

    const dbAllHashes = await pullAllHashesDB(options.dbName);

    const [filesList_dbUniq, filesList_dbDups] = findDuplicatesInDB(
      filesList_importUniq,
      dbAllHashes
    );

    let copyMediaResults;
    if (options.dryRunCopyMedia) {
      copyMediaResults = filesList_dbUniq.map(() => [false, true, false, true]);
    } else {
      copyMediaResults = await copyMediaToRamka(filesList_dbUniq);
    }
    const [filesList_copyGood, filesList_copyFailed] = filterOutCopyFailed(
      filesList_dbUniq,
      copyMediaResults
    );

    const mediaListForDB = prepareDBRecord(filesList_copyGood);

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
      filesListExifError: filesList_exifError,
      filesListDuplicatesImport: filesList_importDups,
      filesListDuplicatesDB: filesList_dbDups,
      filesListNoDates: noDateFilesList,
      filesListCopyFailed: filesList_copyFailed,
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
