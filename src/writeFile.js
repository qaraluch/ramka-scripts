const fs = require("fs");
const util = require("util");

const fsWriteFile = util.promisify(fs.writeFile);

async function writeFile(outputPath, data) {
  try {
    await fsWriteFile(outputPath, data);
  } catch (error) {
    throw new Error(
      `writeFile.js - sth. went wrong with writing file: ${outputPath} on the disk. \n ${error}`
    );
  }
}

module.exports = { writeFile };
