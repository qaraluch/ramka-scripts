const PouchDB = require("pouchdb");
const path = require("path");

//TODO: add to tiljs when db operations will be stabile
const nameDB = ".DB-ramka";

function initDB(name) {
  let db = new PouchDB(name);
  return db;
}

async function putNewMediaToDB(mediaList) {
  let db = initDB(nameDB);
  try {
    let result = await db.bulkDocs(mediaList);
    return result;
  } catch (error) {
    throw new Error(
      `talkDB - putNewMediaToDB() - Sth. went wrong: ...\n ${error}`
    );
  }
}

function prepareDBRecord(filesList) {
  const DBrecords = filesList.map(DBrecordsMapper);
  return DBrecords;
}

function DBrecordsMapper(itm) {
  const {
    hash,
    fileMetadata,
    exif,
    importedPath,
    outputDir,
    outputYear,
    outputFileName,
    outputFileNameSquare
  } = itm;
  const DBrecord = {
    _id: hash,
    hash,
    fileMetadata,
    exif: exif.data,
    importedPath,
    source: `${path.join(outputDir, outputYear, outputFileName)}`,
    sourceSquare: `${path.join(outputDir, outputYear, outputFileNameSquare)}`
  };
  return DBrecord;
}

module.exports = {
  initDB,
  prepareDBRecord,
  putNewMediaToDB
};
