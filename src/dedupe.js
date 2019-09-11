const { dedupeInit } = require("qm-dedupe");

const hasher = JSON.stringify;
const compareByProperty = item => item.hash;

const dedupe = dedupeInit({ hasher, compareByProperty });

function findDuplicatesInInportedFiles(filesList) {
  const result = dedupe(filesList);
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

function findDuplicatesInDB(filesList, dbAllHashes) {
  const testFn = itm => dbAllHashes.includes(itm.hash);
  const result = dedupeByFn(filesList, testFn);
  return result; // [uniqs, dups]
}

module.exports = {
  findDuplicatesInInportedFiles,
  findDuplicatesInDB
};
