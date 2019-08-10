const { walkDir } = require("./walker");
const { hashFile } = require("./hashFile");
const { getExif } = require("./getExif");
const { throttleIt } = require("./throttleIt");
const { copyFile } = require("./copyFile");
const { cropSquareImage } = require("./cropSquareImage");
const { parseCSFileName } = require("./utils");
const path = require("path");

const importDirHome = "/mnt/h/ramka/data/images/";

async function walkInputDir(inputPath) {
  const filesInfo = await walkDir(inputPath);
  const filesInfoFileMetadata = creatFilesList(filesInfo);
  return filesInfoFileMetadata;
}

function creatFilesList(filesInfo) {
  const newFilesList = filesInfo.map(itm => {
    let newItm = {
      importedPath: itm.path,
      fileMetadata: itm
    };
    return newItm;
  });
  return newFilesList;
}

async function readExtraMetadataInfo(filesList) {
  const readInfosThrottled = throttleIt(performReadInfo, 10);
  const results = await readInfosThrottled(filesList);
  return results;
}

async function performReadInfo(itm) {
  try {
    const { importedPath: path } = itm;
    const hash = await hashFile(path);
    const exif = await getExif(path);
    const newItm = { hash, exif, ...itm };
    return newItm;
  } catch (error) {
    throw new Error(`readFilesInfos.js - Sth. went wrong: ...\n ${error}`);
  }
}

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

async function copyMediaToRamka(filesList) {
  const readInfosThrottled = throttleIt(performCopyMedia, 10);
  const results = await readInfosThrottled(filesList);
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
  walkInputDir,
  readExtraMetadataInfo,
  calculateOutputPaths,
  copyMediaToRamka
};
