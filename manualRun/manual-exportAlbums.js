const { exportAlbums } = require("../src/exportAlbums");

//TODO: add to config.js
const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  dbName: "../.DB-ramka",
  albumsDir: "/mnt/h/ramka/albums",
  // dryRunCopyMedia: false, // dryRunCreateAlbums maybe?
  loggerOptions: {
    silent: false,
    delimiter: " ramka ",
    disableFileLogs: false,
    logOutputDir: "../logs",
    logFilePrefix: "logs-exportAlbums", // rest of file name: -<time-stamp>.log
  },
};

async function exportAlbumsRun(options) {
  try {
    await exportAlbums(options);
  } catch (error) {
    throw new Error(error);
  }
}

exportAlbumsRun(options);
