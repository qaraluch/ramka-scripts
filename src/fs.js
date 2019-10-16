const { walkDir } = require("./walker");
const { hashFile } = require("./hashFile");
const { getExif } = require("./getExif");
const { throttleIt } = require("./throttleIt");
const { copyFile } = require("./copyFile");
const { cropSquareImage } = require("./cropSquareImage");
const { parseCSFileName } = require("./utils");
const path = require("path");

async function walkInputDir(optionsMediaImportDir) {
  const filesInfo = await walkDir(optionsMediaImportDir);
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
  const filesList_extraInfo = await readInfosThrottled(filesList);
  const filesList_exifError = filterExifErrorItems(filesList_extraInfo);
  return [filesList_extraInfo, filesList_exifError];
}

function filterExifErrorItems(filesList) {
  const result = filesList.filter(itm => itm.exif.error !== null);
  return result;
}

async function performReadInfo(itm) {
  const { importedPath: path } = itm;
  const hash = await hashFile(path);
  const exif = await getExif(path);
  const newItm = { hash, exif, ...itm };
  return newItm;
}

const noDataDirName = "beforeTime";
const noDateFilter = itm => itm.outputYear === noDataDirName;

function calculateOutputPaths(
  filesList,
  optionsMediaRepoDir,
  optionsRamkaHomeDir
) {
  function outputPathsMapper(itm) {
    const {
      fileMetadata: { name: fileName, ext: extension },
      hash
    } = itm;
    const { year: fileNameYear } = parseCSFileName(fileName);
    itm.outputDir = optionsMediaRepoDir;
    itm.outputYear = fileNameYear || noDataDirName;
    const {
      outputFileName,
      outputFileNameSquare
    } = calculateOutputMainFileName(hash, extension);
    itm.outputFileNameSquare = outputFileNameSquare;
    itm.outputFileName = outputFileName;
    itm.outputHomeDir = optionsRamkaHomeDir;
    return itm;
  }

  const updatedFilesList = filesList.map(outputPathsMapper);
  const noDateFilesList = updatedFilesList.filter(noDateFilter);
  return [updatedFilesList, noDateFilesList];
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
    outputHomeDir,
    outputDir,
    outputYear,
    outputFileName,
    outputFileNameSquare
  } = itm;
  const destination = path.resolve(
    outputHomeDir,
    outputDir,
    outputYear,
    outputFileName
  );
  const destinationSquare = path.resolve(
    outputHomeDir,
    outputDir,
    outputYear,
    outputFileNameSquare
  );
  const [errorCp, resultCp] = await copyFile(source, destination);
  const [errorCrop, resultCrop] = await cropSquareImage(
    source,
    destinationSquare
  );
  return [errorCp, resultCp, errorCrop, resultCrop];
}

function filterOutCopyFailed(filesList, copyResults) {
  const copyResultsGoodTable = copyResults.map(itm =>
    itm[1] === true && itm[3] === true ? true : false
  );

  const copyFailedReducer = (accumulator, current, idx) => {
    const accumulatorGood = accumulator[0];
    const accumulatorBad = accumulator[1];
    const currentWithExtraInfo = {
      ...current,
      copyErrorMsg: copyResults[idx][0],
      copySuccess: copyResults[idx][1],
      cropErrorMsg: copyResults[idx][2],
      cropSuccess: copyResults[idx][3]
    };
    if (copyResultsGoodTable[idx]) {
      return [[...accumulatorGood, currentWithExtraInfo], [...accumulatorBad]];
    } else {
      return [[...accumulatorGood], [...accumulatorBad, currentWithExtraInfo]];
    }
  };

  const filesLists = filesList.reduce(copyFailedReducer, [[], []]);
  return filesLists; // [good, failed]
}

function listImportedDupPaths(filesListUniq, filesListDups) {
  if (Array.isArray(filesListDups) && !filesListDups.length == 0) {
    const dupHashes = filesListDups.map(itm => itm.hash);
    const result = filesListUniq.reduce((acc, cur) => {
      const hash = cur.hash;
      const dupIdx = dupHashes.indexOf(hash);
      if (dupIdx >= 0) {
        return [
          ...acc,
          [hash, cur.importedPath, filesListDups[dupIdx].importedPath]
        ];
      } else {
        return acc;
      }
    }, []);
    return result;
  }
}

module.exports = {
  walkInputDir,
  readExtraMetadataInfo,
  calculateOutputPaths,
  copyMediaToRamka,
  filterOutCopyFailed,
  listImportedDupPaths
};
