const {
  walkInputDir,
  readExtraMetadataInfo,
  copyMediaToRamka,
  calculateOutputPaths
} = require("./fs");
const { putNewMediaToDB, prepareDBRecord } = require("./db");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";

async function importMedia() {
  try {
    const filesList = await walkInputDir(dirCsImportDir);
    const inputCount = filesList.length;
    const filesList_extraInfo = await readExtraMetadataInfo(filesList);
    const filesList_outputPaths = calculateOutputPaths(filesList_extraInfo);
    await copyMediaToRamka(filesList_outputPaths);
    //TODO: zwraca pozytywy przy kopiowaniu, jeżeli all good to contynuacja.
    const mediaListForDB = prepareDBRecord(filesList_outputPaths);
    const confirmations = await putNewMediaToDB(mediaListForDB);
    const outputCount = confirmations.length;
    const result = { inputCount, outputCount };
    return result;
  } catch (error) {
    throw new Error(`importMedia.js - Sth. went wrong: ...\n ${error}`);
  }
}

module.exports = {
  importMedia
};
