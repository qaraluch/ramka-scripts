const cp = require("cp-file");

async function copyFile(source, destination, options = { overwrite: false }) {
  try {
    await cp(source, destination, options);
    return destination;
  } catch (error) {
    throw new Error(`copyFile.js - Sth. went wrong: ...\n ${error}`);
  }
}

module.exports = {
  copyFile
};
