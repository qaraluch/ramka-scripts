const walk = require("qm-walk");

const globOptions = { nocase: true };
// const glob = ["*.jpg", "*.jpeg", "*.png", "*.mp4", "*.gif", "*.mov"];
const glob = ["*.jpg", "*.jpeg", "*.png", "*.gif"];

async function walkDir(path) {
  try {
    const walkOutputExt = await walk({ path });
    const filesExtended = walkOutputExt
      .getExtendedInfo()
      .match(glob, globOptions);
    const filesList = filesExtended.map(item => item.isFile && item);
    return filesList;
  } catch (error) {
    throw new Error(
      `walker.js - sth. went wrong with walking a dir: ${path} on the disk. \n ${error.stack}`
    );
  }
}

module.exports = {
  walkDir
};
