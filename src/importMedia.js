const {
  walkInputDir,
  readExtraMetadataInfo,
  copyMediaToRamka,
  calculateOutputPaths
} = require("./fs");
const { putNewMediaToDB, calculateDBRecord } = require("./db");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";

async function importMedia() {
  try {
    const filesList = await walkInputDir(dirCsImportDir);
    const filesList_extraInfo = await readExtraMetadataInfo(filesList);
    const filesList_outputPaths = calculateOutputPaths(filesList_extraInfo);
    await copyMediaToRamka(filesList_outputPaths);
    const mediaListForDB = calculateDBRecord(filesList_outputPaths);
    const confirmations = await putNewMediaToDB(mediaListForDB);
    const result = confirmations;
    return result;
  } catch (error) {
    throw new Error(`importMedia.js - Sth. went wrong: ...\n ${error}`);
  }
}

module.exports = {
  importMedia
};
