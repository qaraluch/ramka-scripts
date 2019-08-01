let PouchDB = require("pouchdb");

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

module.exports = {
  initDB,
  putNewMediaToDB
};
