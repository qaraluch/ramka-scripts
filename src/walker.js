const walk = require("qm-walk");

async function walkDir(path) {
  try {
    const walkOutputExt = await walk({ path });
    const filesExtended = walkOutputExt.getExtendedInfo().result;
    return filesExtended;
  } catch (error) {
    throw new Error(
      `walker.js - sth. went wrong with walking a dir: ${path} on the disk. \n ${error}`
    );
  }
}

module.exports = {
  walkDir
};
