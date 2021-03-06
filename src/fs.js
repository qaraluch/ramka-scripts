const { walkDir } = require("./walker");
const { hashFile } = require("./hashFile");
const { getExif } = require("./getExif");
const { throttleIt } = require("./throttleIt");
const { copyFile } = require("./copyFile");
const { cropSquareImage } = require("./cropSquareImage");
const { parseCSFileName } = require("./utils");
const { createHardLink } = require("./createHardLink.js");
const rimraf = require("rimraf");
const path = require("path");

// for inportMedia fn
async function walkInputDir(optionsMediaImportDir) {
  const fileInfo = await walkDir(optionsMediaImportDir);
  const fileInfoFileMetadata = creatFilesList(fileInfo);
  return fileInfoFileMetadata;
}

function limitImportMedia(fileList, limit) {
  if (limit) {
    return fileList.slice(0, limit);
  } else {
    return fileList;
  }
}

function creatFilesList(fileInfo) {
  const newFilesList = fileInfo.map((itm) => {
    let newItm = {
      importedPath: itm.path,
      fileMetadata: itm,
    };
    return newItm;
  });
  return newFilesList;
}

async function readMetadataHash(fileList, logProgressBar) {
  const readInfosThrottled = throttleIt(
    performReadInfoHash,
    10,
    logProgressBar
  ); //logProgressBar as thisObj - injection
  const fileList_extraInfo = await readInfosThrottled(fileList);
  return fileList_extraInfo;
}

async function performReadInfoHash(itm) {
  const { importedPath: path } = itm;
  const hash = await hashFile(path);
  const newItm = { hash, ...itm };
  this.tick(); //logProgressBar execution
  return newItm;
}

async function readMetadataExif(fileList) {
  const readInfosThrottled = throttleIt(performReadInfoExif, 10);
  const fileList_extraInfo = await readInfosThrottled(fileList);
  const fileList_exifError = filterExifErrorItems(fileList_extraInfo);
  return [fileList_extraInfo, fileList_exifError];
}

function filterExifErrorItems(fileList) {
  const result = fileList.filter((itm) => itm.exif.error !== null);
  return result;
}

async function performReadInfoExif(itm) {
  const { importedPath: path } = itm;
  const exif = await getExif(path);
  const newItm = { exif, ...itm };
  return newItm;
}

const noDataDirName = "beforeTime";
const noDateFilter = (itm) => itm.outputYear === noDataDirName;

function calculateOutputPaths(
  fileList,
  optionsMediaRepoDir,
  optionsRamkaHomeDir
) {
  function outputPathsMapper(itm) {
    const {
      fileMetadata: { name: fileName, ext: extension },
      hash,
    } = itm;
    const parsedFileName = parseCSFileName(fileName);
    itm.outputDir = optionsMediaRepoDir;
    itm.outputYear = parsedFileName.year || noDataDirName;
    const {
      outputFileName,
      outputFileNameSquare,
    } = calculateOutputMainFileName(hash, extension);
    itm.outputFileNameSquare = outputFileNameSquare;
    itm.outputFileName = outputFileName;
    itm.outputHomeDir = optionsRamkaHomeDir;
    itm.parsedFileName = parsedFileName;
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

async function copyMediaToRamka(fileList, logProgressBar) {
  const copyMediaThrottled = throttleIt(performCopyMedia, 10, logProgressBar);
  const results = await copyMediaThrottled(fileList);
  return results;
}

async function performCopyMedia(itm) {
  const {
    importedPath: source,
    outputHomeDir,
    outputDir,
    outputYear,
    outputFileName,
    outputFileNameSquare,
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
  this.tick(); //logProgressBar execution
  return [errorCp, resultCp, errorCrop, resultCrop];
}

function filterOutCopyFailed(fileList, copyResults) {
  const copyResultsGoodTable = copyResults.map((itm) =>
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
      cropSuccess: copyResults[idx][3],
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
    const dupHashes = fileListDups.map((itm) => itm.hash);
    const result = fileListUniq.reduce((acc, cur) => {
      const hash = cur.hash;
      const dupIdx = dupHashes.indexOf(hash);
      if (dupIdx >= 0) {
        return [
          ...acc,
          [hash, cur.importedPath, fileListDups[dupIdx].importedPath],
        ];
      } else {
        return acc;
      }
    }, []);
    return result;
  } else {
    return [];
  }
}

// for exportAlbums fn
function removeDirSync(dirPath) {
  rimraf.sync(dirPath);
}

function createHardlinksArgs(dirNameArray, reducerFn) {
  return function reduceInfo(dbInfo, options) {
    const results = dbInfo.reduce(reducerFn, {
      args: [],
      options,
      dirName: dirNameArray,
    });
    return results.args;
  };
}

// Reducers for createHardlinksArgs fn:
function getAllPhotosReducer(accumulator, nextValue) {
  const { date, version, comment } = nextValue.parsedFileName;
  const { name: fileName } = nextValue.fileMetadata;
  const source = path.resolve(
    accumulator.options.ramkaHomeDir,
    nextValue.source
  );
  const destination = path.resolve(
    accumulator.options.albumsDir,
    accumulator.dirName.join(""),
    nextValue.parsedFileName.year
      ? createAlbumMediaFileName(date, version, comment)
      : // for beforeTime media files in DB
        fileName
  );
  return {
    ...accumulator,
    args: [...accumulator.args, ...[[source, destination]]],
  };
}

function getAllPhotosSquareReducer(accumulator, nextValue) {
  const { date, version, comment } = nextValue.parsedFileName;
  const { name: fileName } = nextValue.fileMetadata;
  const source = path.resolve(
    accumulator.options.ramkaHomeDir,
    nextValue.sourceSquare
  );
  const destination = path.resolve(
    accumulator.options.albumsDir,
    accumulator.dirName.join(""),
    nextValue.parsedFileName.year
      ? createAlbumMediaFileName(date, version, comment)
      : // for beforeTime media files in DB
        fileName
  );
  return {
    ...accumulator,
    args: [...accumulator.args, ...[[source, destination]]],
  };
}

function createAlbumMediaFileName(date, version, comment) {
  const joinChar = "-";
  // modify filename (no spaces)
  // used in the albums dirs by script: exportAlbums
  const results = `${date}-${version}-${comment}`.replace(/\s/g, joinChar);
  return results;
}

async function createAlbums(albumsCreationsArgsObj) {
  return Promise.all(
    Object.entries(albumsCreationsArgsObj).map(async (itm) => {
      const [key, args] = itm;
      const createHardLinkThrottled = throttleIt(performCreateHardLink, 10);
      await createHardLinkThrottled(args);
      return [key, args.length];
    })
  );
}

async function performCreateHardLink(hardLinksArgsItm) {
  const [source, destination] = hardLinksArgsItm;
  await createHardLink(source, destination);
}

module.exports = {
  walkInputDir,
  limitImportMedia,
  readMetadataHash,
  readMetadataExif,
  calculateOutputPaths,
  copyMediaToRamka,
  filterOutCopyFailed,
  listImportedDupPaths,
  removeDirSync,
  createHardlinksArgs,
  getAllPhotosReducer,
  getAllPhotosSquareReducer,
  createAlbums,
};
