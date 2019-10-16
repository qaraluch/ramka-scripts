const { walkDir } = require("./walker");
const { hashFile } = require("./hashFile");
const { getExif } = require("./getExif");
const { throttleIt } = require("./throttleIt");
const { copyFile } = require("./copyFile");
const { cropSquareImage } = require("./cropSquareImage");
const { parseCSFileName } = require("./utils");
const path = require("path");

async function walkInputDir(optionsMediaImportDir) {
  const fileInfo = await walkDir(optionsMediaImportDir);
  const fileInfoFileMetadata = creatFilesList(fileInfo);
  return fileInfoFileMetadata;
}

function creatFilesList(fileInfo) {
  const newFilesList = fileInfo.map(itm => {
    let newItm = {
      importedPath: itm.path,
      fileMetadata: itm
    };
    return newItm;
  });
  return newFilesList;
}

async function readExtraMetadataInfo(fileList) {
  const readInfosThrottled = throttleIt(performReadInfo, 10);
  const fileList_extraInfo = await readInfosThrottled(fileList);
  const fileList_exifError = filterExifErrorItems(fileList_extraInfo);
  return [fileList_extraInfo, fileList_exifError];
}

function filterExifErrorItems(fileList) {
  const result = fileList.filter(itm => itm.exif.error !== null);
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
  fileList,
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

  const updatedFilesList = fileList.map(outputPathsMapper);
  const noDateFilesList = updatedFilesList.filter(noDateFilter);
  return [updatedFilesList, noDateFilesList];
}

function calculateOutputMainFileName(hash, extension) {
  const outputFileName = `${hash}${extension}`;
  const outputFileNameSquare = `${hash}_square${extension}`;
  return { outputFileName, outputFileNameSquare };
}

async function copyMediaToRamka(fileList) {
  const readInfosThrottled = throttleIt(performCopyMedia, 10);
  const results = await readInfosThrottled(fileList);
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

function filterOutCopyFailed(fileList, copyResults) {
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

  const fileLists = fileList.reduce(copyFailedReducer, [[], []]);
  return fileLists; // [good, failed]
}

function listImportedDupPaths(fileListUniq, fileListDups) {
  if (Array.isArray(fileListDups) && !fileListDups.length == 0) {
    const dupHashes = fileListDups.map(itm => itm.hash);
    const result = fileListUniq.reduce((acc, cur) => {
      const hash = cur.hash;
      const dupIdx = dupHashes.indexOf(hash);
      if (dupIdx >= 0) {
        return [
          ...acc,
          [hash, cur.importedPath, fileListDups[dupIdx].importedPath]
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
