const { walkDir } = require("./walker");
const { hashFile } = require("./hashFile");
const { getExif } = require("./getExif");
const { throttleIt } = require("./throttleIt");

async function readFilesInfos(inputPath) {
  const filesInfo = await walkDir(inputPath);
  const filesInfoFileMetadata = creatFilesList(filesInfo);
  const filesInfoExifHash = await readExtraInfo(filesInfoFileMetadata);
  return filesInfoExifHash;
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

async function readExtraInfo(filesInfo) {
  const readInfosThrottled = throttleIt(performReadInfo, 10);
  const results = await readInfosThrottled(filesInfo);
  return results;
}

async function performReadInfo(itm) {
  const { importedPath: path } = itm;
  const hash = await hashFile(path);
  const exif = await getExif(path);
  const newItm = { hash, exif, ...itm };
  return newItm;
}

module.exports = {
  readFilesInfos
};
