const exiftool = require("node-exiftool");
const exiftoolBin = require("dist-exiftool");

//TODO: add to tiljs
async function getExif(path) {
  const ep = new exiftool.ExiftoolProcess(exiftoolBin);
  await ep.open();
  let info;
  try {
    info = await ep.readMetadata(path, ["-File:all"]);
  } catch (error) {
    throw new Error(
      `getExif.js - sth. went wrong with getting exif data of a file: ${path}. \n ${error}`
    );
  }
  await ep.close();
  return info;
}

module.exports = {
  getExif
};
