const { throttleIt } = require("./throttleIt");
const { copyFile } = require("./copyFile");
const { path } = require("path");
const { cropSquareImage } = require("./cropSquareImage");

async function copyMediaToRamka(fileLists) {
  const readInfosThrottled = throttleIt(performCopyMedia, 10);
  const results = await readInfosThrottled(fileLists);
  return results;
}

async function performCopyMedia(itm) {
  const {
    importedPath: source,
    outputDir,
    outputFileName,
    outputFileNameSquare
  } = itm;
  const destination = path.resolve(outputDir, outputFileName);
  const destinationSquare = path.resolve(outputDir, outputFileNameSquare);
  try {
    await copyFile(source, destination);
    await cropSquareImage(source, destinationSquare);
  } catch (error) {
    throw new Error(
      `fs.js copyMediaToRamka() - Sth. went wrong: ...\n ${error}`
    );
  }
}

module.exports = {
  copyMediaToRamka
};
