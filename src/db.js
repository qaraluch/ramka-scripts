let PouchDB = require("pouchdb");
const path = require("path");

//TODO: add to tiljs
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

function calculateDBRecord(filesList) {
  const DBrecords = filesList.map(DBrecordsMapper);
  return DBrecords;
}

function DBrecordsMapper(itm) {
  const {
    hash,
    exif,
    importedPath,
    outputDir,
    outputFileName,
    outputFileNameSquare
  } = itm;
  const DBrecord = {
    _id: hash,
    exif: exif.data,
    importedPath,
    source: `${path.resolve(outputDir, outputFileName)}`,
    sourceSquare: `${path.resolve(outputDir, outputFileNameSquare)}`
  };
  return DBrecord;
}

module.exports = {
  initDB,
  calculateDBRecord,
  putNewMediaToDB
};
