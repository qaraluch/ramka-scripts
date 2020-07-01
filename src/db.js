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
      `db.js - putNewMediaToDB() - Sth. went wrong: ...\n ${error}`
    );
  }
}

function prepareDBRecord(fileList) {
  const currentDateObj = { date: Date.now() };
  const DBrecords = fileList.map(DBrecordsMapper, currentDateObj);
  return DBrecords;
}

function DBrecordsMapper(itm) {
  const {
    hash,
    fileMetadata,
    exif,
    importedPath,
    parsedFileName,
    outputDir,
    outputYear,
    outputFileName,
    outputFileNameSquare,
  } = itm;
  const DBrecord = {
    _id: hash,
    hash,
    fileMetadata,
    exif: exif.data,
    importedPath,
    importedDate: this.date, //access point of currentDateObj
    parsedFileName,
    source: `${path.join(outputDir, outputYear, outputFileName)}`,
    sourceSquare: `${path.join(outputDir, outputYear, outputFileNameSquare)}`,
  };
  return DBrecord;
}

async function pullDataDB(dbName, reducerFn) {
  let db = initDB(dbName);
  const allDocs = await db.allDocs({ include_docs: true });
  const allDocsReduced = allDocs.rows.reduce(reducerFn, []);
  return allDocsReduced;
}

async function pullAllHashesDB(dbName) {
  try {
    const allHashes = await pullDataDB(dbName, (acc, next) => [
      ...acc,
      next.doc.hash,
    ]);
    return allHashes;
  } catch (error) {
    throw new Error(
      `db.js - pullAllHashesDB() - Sth. went wrong: ...\n ${error}`
    );
  }
}

async function pullAllInfoDB(dbName) {
  try {
    const allInfo = await pullDataDB(dbName, (acc, next) => [...acc, next.doc]);
    return allInfo;
  } catch (error) {
    throw new Error(
      `db.js - pullAllInfoDB() - Sth. went wrong: ...\n ${error}`
    );
  }
}

function filterConfirmationFailed(confirmations) {
  return confirmations.filter((itm) => itm.error === true);
}

module.exports = {
  initDB,
  prepareDBRecord,
  putNewMediaToDB,
  pullAllHashesDB,
  pullAllInfoDB,
  filterConfirmationFailed,
};
