const { importMedia } = require("../src/importMedia");

//TODO: add to config.js
const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  mediaRepoDir: "data/images",
  mediaImportDir: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  dbName: ".DB-ramka",
  dryRunCopyMedia: true,
  dryRunDBPut: false
};

async function runDryRun() {
  try {
    const result = await importMedia(options);

    const {
      inputCount,
      outputCount,
      filesListExifError,
      filesListDuplicatesImport,
      filesListDuplicatesDB,
      filesListNoDates,
      filesListCopyFailed,
      confirmations,
      confirmationsFailed
    } = result;

    console.log("inputCount ---->", inputCount);
    console.log("outputCount ---->", outputCount);
    console.log("filesListExifError ---->", filesListExifError.length);
    console.log(
      "filesListDuplicatesImport ---->",
      filesListDuplicatesImport.length
    );
    console.log("filesListDuplicatesDB ---->", filesListDuplicatesDB.length);
    console.log("filesListNoDates ---->", filesListNoDates.length);
    console.log("filesListCopyFailed ---->", filesListCopyFailed.length);
    console.log("confirmationso ---->", confirmations.length);
    console.log("confirmationsFailed ---->", confirmationsFailed.length);
  } catch (error) {
    throw new Error(error);
  }
}

runDryRun();
