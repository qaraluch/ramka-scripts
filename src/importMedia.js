const { readFilesInfos } = require("./readFilesInfos");
const {
  calculateOutputPaths,
  calculateDBRecord,
  calculateFilnalResultData
} = require("./importMediaInfoCalculations");
const { outputFilesToRamka } = require("./fs");
const { putToDBNewMedia } = require("./talkDB");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";

async function importMedia() {
  const fileListWithFilesInfo = await readFilesInfos(dirCsImportDir);
  const fileListWithOutputPaths = calculateOutputPaths(fileListWithFilesInfo);
  const fileListForOutput = await outputFilesToRamka(fileListWithOutputPaths);
  const fileListForDB = calculateDBRecord(fileListForOutput);
  const addedList = await putToDBNewMedia(fileListForDB);
  const results = calculateFilnalResultData(addedList);
  return results;
}

module.exports = {
  importMedia
};
