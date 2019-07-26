const path = require("path");
const { parseCSFileName } = require("./utils");

const importDirHome = "/mnt/h/ramka/back/data/images/";

function calculateOutputPaths(filesList) {
  const updatedFilesList = filesList.map(outputPathsMapper);
  return updatedFilesList;
}

function outputPathsMapper(itm) {
  const {
    fileMetadata: { name: fileName, ext: extension },
    hash
  } = itm;
  const { year: fileNameYear } = parseCSFileName(fileName);
  itm.outputDir = calculateOutputDir(fileNameYear);
  const { outputFileName, outputFileNameSquare } = calculateOutputMainFileName(
    hash,
    extension
  );
  itm.outputFileNameSquare = outputFileNameSquare;
  itm.outputFileName = outputFileName;
  return itm;
}

function calculateOutputDir(fileNameYear) {
  const outputDir = path.resolve(importDirHome, fileNameYear);
  return outputDir;
}

function calculateOutputMainFileName(hash, extension) {
  const outputFileName = `${hash}${extension}`;
  const outputFileNameSquare = `${hash}_square${extension}`;
  return { outputFileName, outputFileNameSquare };
}

module.exports = {
  calculateOutputPaths
};
