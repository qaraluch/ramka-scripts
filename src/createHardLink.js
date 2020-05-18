const fse = require("fs-extra");
// [node-fs-extra/ensureLink.md at master · jprichardson/node-fs-extra](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureLink.md)

async function createHardLink(source, destination) {
  try {
    await fse.ensureLink(source, destination);
    return destination;
  } catch (error) {
    throw new Error(
      `createHardLinks.js - Sth. went wrong: with creating hardlink from source file ${source} to ${destination} ...\n ${error.stack}`
    );
  }
}

module.exports = {
  createHardLink,
};
