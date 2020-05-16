const jimp = require("jimp");
// [oliver-moran/jimp: An image processing library written entirely in JavaScript for Node, with zero external or native dependencies.](https://github.com/oliver-moran/jimp)

async function cropSquareImage(file, outputPath) {
  try {
    const image = await jimp.read(file);
    image.cover(150, 150); // size
    image.write(outputPath);
    return [false, true];
  } catch (error) {
    const verror = new Error(
      `cropSquareImage.js - Sth. went wrong: with ${file} to ${outputPath}...\n ${error}`
    );
    return [verror, false];
  }
}

module.exports = {
  cropSquareImage,
};
