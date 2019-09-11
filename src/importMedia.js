const {
  walkInputDir,
  readExtraMetadataInfo,
  copyMediaToRamka,
  calculateOutputPaths
} = require("./fs");
const { putNewMediaToDB, prepareDBRecord, pullAllHashesDB } = require("./db");
const {
  findDuplicatesInInportedFiles,
  findDuplicatesInDB
} = require("./dedupe.js");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";

async function importMedia() {
  try {
    const filesList = await walkInputDir(dirCsImportDir);
    const inputCount = filesList.length;
    const filesList_extraInfo = await readExtraMetadataInfo(filesList);
    const filesList_outputPaths = calculateOutputPaths(filesList_extraInfo);
    const [
      filesList_importUniq,
      filesList_importDups
    ] = findDuplicatesInInportedFiles(filesList_outputPaths);
    const dbAllHashes = await pullAllHashesDB();
    const [filesList_dbUniq, filesList_dbDups] = findDuplicatesInDB(
      filesList_importUniq,
      dbAllHashes
    );
    //TODO: implement reporting of filesList_importDups
    await copyMediaToRamka(filesList_dbUniq);
    //TODO: zwraca pozytywy przy kopiowaniu, jeżeli all good to contynuacja.
    const mediaListForDB = prepareDBRecord(filesList_dbUniq);
    const confirmations = await putNewMediaToDB(mediaListForDB);
    const outputCount = confirmations.length;
    const result = { inputCount, outputCount };
    return result;
  } catch (error) {
    throw new Error(`importMedia.js - Sth. went wrong: ...\n ${error.stack}`);
    //TODO: add stack to all error calls
  }
}

module.exports = {
  importMedia
};
