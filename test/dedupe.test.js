const { findDuplicatesInDB } = require("../src/dedupe");

const fileList = [
  { hash: "111fakehash0" },
  { hash: "111fakehash1" },
  { hash: "111fakehash2" },
];

const dbAllHashes = ["111fakehash2"];

const expectedDedupe = [
  [{ hash: "111fakehash0" }, { hash: "111fakehash1" }],
  [{ hash: "111fakehash2" }],
];
// [uniq, dups]

test("should find duplicate elements in DB and remove it from importes file list", () => {
  const actual = findDuplicatesInDB(fileList, dbAllHashes);
  const expected = expectedDedupe;
  expect(actual).toEqual(expected);
});
