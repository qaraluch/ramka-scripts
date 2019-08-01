const { readFilesInfos } = require("./readFilesInfos");
const { calculateOutputPaths } = require("./outputPaths");
const { copyMediaToRamka } = require("./fs");
const { putNewMediaToDB } = require("./talkDB");
const path = require("path");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";

async function importMedia() {
  try {
    const fileListWithFilesInfo = await readFilesInfos(dirCsImportDir);
    const fileListWithOutputPaths = calculateOutputPaths(fileListWithFilesInfo);
    await copyMediaToRamka(fileListWithOutputPaths);
    const mediaListForDB = calculateDBRecord(fileListWithOutputPaths);
    const confirmations = await putNewMediaToDB(mediaListForDB);
    const result = confirmations;
    return result;
  } catch (error) {
    throw new Error(`importMedia.js - Sth. went wrong: ...\n ${error}`);
  }
}

function calculateDBRecord(filesList) {
  const DBrecords = filesList.map(DBrecordsMapper);
  return DBrecords;
}

function DBrecordsMapper(itm) {
  const {
    hash,
    exif,
    importedPath,
    outputDir,
    outputFileName,
    outputFileNameSquare
  } = itm;
  const DBrecord = {
    _id: hash,
    exif: exif.data,
    importedPath,
    source: `${path.resolve(outputDir, outputFileName)}`,
    sourceSquare: `${path.resolve(outputDir, outputFileNameSquare)}`
  };
  return DBrecord;
}

module.exports = {
  importMedia
};
