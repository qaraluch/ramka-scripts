/*eslint no-console: "off"*/
// script:
// hardLinkCS.js
// creates hardlinks form source CS photos.
// for incremental integration
const { createHardLink } = require("../src/createHardLink.js");
const { throttleIt } = require("../src/throttleIt");
const rimraf = require("rimraf");
const path = require("path");
const infoFilePath = "/mnt/h/ramka/info/cs-hardlinks-paths.js";
const infoFile = require(`${infoFilePath}`);
const CSDestinationDir = "/mnt/g/cs-hardlinks";

(async () => {
  console.log("[ ramka scripts ] create-hardlinks-cs");
  console.log("[ ramka scripts ] About to create... ");
  console.log(
    "[ ramka scripts ] hardlinks from CS dir based on list in the file: "
  );
  console.log(`[ ramka scripts ] ... ${infoFilePath}`);
  console.log("[ ramka scripts ] into dir:");
  console.log(`[ ramka scripts ] ... ${CSDestinationDir}`);
  try {
    rimraf.sync(CSDestinationDir);
    console.log(`[ ramka scripts ] Cleaned up '${CSDestinationDir}' dir!`);
    await createHardLinks(infoFile);
    console.log("[ Done! ]");
  } catch (error) {
    throw new Error(`Sth. went wrong: ... \n ${error}`);
  }
})();

async function createHardLinks(fileList) {
  const createHardLinkThrottled = throttleIt(performCreateHardLink, 10);
  console.log("[ ramka scripts ] about to create hardlinks...");
  await createHardLinkThrottled(fileList);
}

async function performCreateHardLink(filePath) {
  const fileName = path.basename(filePath);
  const destinationPath = path.resolve(CSDestinationDir, fileName);
  await createHardLink(filePath, destinationPath);
}
