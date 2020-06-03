const { initLogger, initProgressBarBasic } = require("./logger");
const {
  removeDirSync,
  createHardlinksArgs,
  getAllPhotosReducer,
  getAllPhotosSquareReducer,
  createAlbums,
} = require("./fs");
const { pullAllInfoDB } = require("./db");

async function exportAlbums(options) {
  const { loggerOptions } = options;
  const { log, logFile } = await initLogger({ loggerOptions });
  log.welcome("exportAlbums");
  log.itWarn(`About to wipe album's dir: ${options.albumsDir}`);
  removeDirSync(options.albumsDir);
  const dbInfo = await pullAllInfoDB(options.dbName);
  log.readDBRecordsCount(dbInfo.length);
  const albumsCreationsArgsObj = {
    all: createHardlinksArgs(["all"], getAllPhotosReducer)(dbInfo, options),
    all_square: createHardlinksArgs(["all-square"], getAllPhotosSquareReducer)(
      dbInfo,
      options
    ),
  };
  const results = await createAlbums(albumsCreationsArgsObj);
  logCreatedAlbums(
    albumsCreationsArgsObj,
    options.disableFileLogs,
    options.albumsDir,
    log,
    logFile
  );
  return results;
}

function logCreatedAlbums(
  albumsCreationsArgsObj,
  disableFileLogs,
  albumsDir,
  log,
  logFile
) {
  if (!disableFileLogs) {
    log.it(`Created albums in dir: ${albumsDir}:`);
    Object.entries(albumsCreationsArgsObj).map((itm) => {
      const [key, args] = itm;
      log.createdAlbum(key, args.length);
      logFile.it(`Created album named: ${key}`, `created-album-${key}`, args);
    });
    log.it("        (see log file)");
  }
}

module.exports = {
  exportAlbums,
};
