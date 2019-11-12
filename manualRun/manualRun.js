const { importMedia } = require("../src/importMedia");

//TODO: add to config.js
const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  mediaRepoDir: "manual/images",
  mediaImportDir: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  dbName: "../manual/.DB-ramka-manual",
  dryRunCopyMedia: false,
  dryRunDBPut: false,
  limitImport: 10,
  loggerOptions: {
    silent: false,
    delimiter: " ramka ",
    disableFileLogs: false,
    logOutputDir: "../manual/logs",
    logFilePrefix: "logs-manual" // rest of file name: -<time-stamp>.log
  }
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
    console.log("confirmations ---->", confirmations.length);
    console.log("confirmationsFailed ---->", confirmationsFailed.length);
  } catch (error) {
    throw new Error(error);
  }
}

runDryRun();
