const { readFilesInfos } = require("./readFilesInfos");
const { calculateOutputPaths } = require("./outputPaths");
const { copyMediaToRamka } = require("./fs");
const { putToDBNewMedia } = require("./talkDB");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";

async function importMedia() {
  try {
    const fileListWithFilesInfo = await readFilesInfos(dirCsImportDir);
    const fileListWithOutputPaths = calculateOutputPaths(fileListWithFilesInfo);
    const fileListForOutput = await copyMediaToRamka(fileListWithOutputPaths);
    const fileListForDB = calculateDBRecord(fileListForOutput);
    const addedList = await putToDBNewMedia(fileListForDB);
    const results = calculateFilnalResultData(addedList);
    return results;
  } catch (error) {
    throw new Error(`importMedia.js - Sth. went wrong: ...\n ${error}`);
  }
}

function calculateDBRecord(filesList) {
  return filesList;
}

function calculateFilnalResultData(addedList) {
  return addedList;
}

module.exports = {
  importMedia
};
