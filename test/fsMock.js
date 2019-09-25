const copyFileMockImplNormal = () => [false, true];

const copyFileMockImplThrow = (source, destination) => [
  new Error(
    `copyFile.js - Sth. went wrong: with file ${source} cp to ${destination} ...\n `
  ),
  false
];

const cropSquareImageMockImplNormal = () => [false, true];

const cropSquareImageMockImplThrow = (file, outputPath) => [
  new Error(
    `cropSquareImage.js - Sth. went wrong: with ${file} to ${outputPath}...\n `
  ),
  false
];

module.exports = {
  copyFileMockImplNormal,
  copyFileMockImplThrow,
  cropSquareImageMockImplNormal,
  cropSquareImageMockImplThrow
};
