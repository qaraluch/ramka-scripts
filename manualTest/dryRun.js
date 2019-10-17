const { importMedia } = require("../src/importMedia");

//TODO: add to config.js
const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  mediaRepoDir: "data/images",
  mediaImportDir: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  dbName: "../.DB-ramka-test",
  dryRunCopyMedia: true,
  dryRunDBPut: false
};

async function runDryRun() {
  try {
    const result = await importMedia(options);

    const {
      inputCount,
      outputCount,
      fileListExifError,
      fileListDuplicatesImport,
      fileListDuplicatesDB,
      fileListNoDates,
      fileListCopyFailed,
      confirmations,
      confirmationsFailed
    } = result;

    console.log("inputCount ---->", inputCount);
    console.log("outputCount ---->", outputCount);
    console.log("fileListExifError ---->", fileListExifError.length);
    console.log(
      "fileListDuplicatesImport ---->",
      fileListDuplicatesImport.length
      // fileListDuplicatesImport
    );
    console.log("fileListDuplicatesDB ---->", fileListDuplicatesDB.length);
    console.log("fileListNoDates ---->", fileListNoDates.length);
    console.log("fileListCopyFailed ---->", fileListCopyFailed.length);
    console.log("confirmationso ---->", confirmations.length);
    console.log("confirmationsFailed ---->", confirmationsFailed.length);
  } catch (error) {
    throw new Error(error);
  }
}

runDryRun();
