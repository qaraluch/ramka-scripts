const PouchDB = require("pouchdb");
const path = require("path");

//TODO: add to tiljs when db operations will be stabile
function initDB(name) {
  let db = new PouchDB(name);
  return db;
}

async function putNewMediaToDB(mediaList, dbName) {
  let db = initDB(dbName);
  try {
    let result = await db.bulkDocs(mediaList);
    return result;
  } catch (error) {
    throw new Error(
      `talkDB - putNewMediaToDB() - Sth. went wrong: ...\n ${error}`
    );
  }
}

function prepareDBRecord(fileList) {
  const DBrecords = fileList.map(DBrecordsMapper);
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

async function pullAllHashesDB(dbName) {
  let db = initDB(dbName);
  try {
    const allDocs = await db.allDocs({ include_docs: true });
    const allHashes = allDocs.rows.map(itm => itm.doc.hash);
    return allHashes;
  } catch (error) {
    throw new Error(
      `talkDB - pullAllHashesDB() - Sth. went wrong: ...\n ${error}`
    );
  }
}

function filterConfirmationFailed(confirmations) {
  return confirmations.filter(itm => itm.error === true);
}

module.exports = {
  initDB,
  prepareDBRecord,
  putNewMediaToDB,
  pullAllHashesDB,
  filterConfirmationFailed
};
