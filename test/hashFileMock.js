const { generateId } = require("../src/utils");

let id = generateId();

function getHashFileDifferent() {
  return Promise.resolve(`111fakehash${id.next().value}`);
}

function getHashFileSame() {
  return Promise.resolve("222fakehashsame0");
}

function resetHashCounter() {
  id = generateId();
}

module.exports = {
  getHashFileDifferent,
  getHashFileSame,
  resetHashCounter
};
