const { dedupeInit } = require("qm-dedupe");

const hasher = JSON.stringify;
const compareByProperty = (item) => item.hash;

const dedupe = dedupeInit({ hasher, compareByProperty });

function findDuplicatesInInportedFiles(fileList) {
  const result = dedupe(fileList);
  return result; // [uniqs, dups]
}

const dedupeByFn = (targetArr, testFn) => {
  const dups = [];
  const uniqs = targetArr.reduce((accumulator, current) => {
    const isUniqueItem = !testFn(current);
    if (isUniqueItem) {
      return [...accumulator, current];
    } else {
      dups.push(current);
      return accumulator;
    }
  }, []);
  return [uniqs, dups];
};

function findDuplicatesInDB(
  fileList,
  dbAllHashes,
  optionsDisableFileLogger,
  log,
  logFile
) {
  const testFn = (itm) => dbAllHashes.includes(itm.hash);
  const result = dedupeByFn(fileList, testFn);
  return result; // [uniqs, dups]
}

module.exports = {
  findDuplicatesInInportedFiles,
  findDuplicatesInDB,
};
