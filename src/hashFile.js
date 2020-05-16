const md5File = require("md5-file/promise");

async function hashFile(path) {
  try {
    const hash = await md5File(path);
    return hash;
  } catch (error) {
    throw new Error(
      `hashFile.js - sth. went wrong with calculate hash for a file: ${path}. \n ${error.stack}`
    );
  }
}

module.exports = {
  hashFile,
};
