const cp = require("cp-file");

async function copyFile(source, destination, options = { overwrite: false }) {
  try {
    await cp(source, destination, options);
    return [false, true];
  } catch (error) {
    const verror = new Error(
      `copyFile.js - Sth. went wrong: with file ${source} cp to ${destination} ...\n ${error}`
    );
    return [verror, false];
  }
}

module.exports = {
  copyFile
};
