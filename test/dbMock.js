// importMedia mocks:
const okObj = {
  ok: true,
  rev: "X-XXXXXXXXXXXXXXXXXXXXXX",
};

const conflictObj = {
  conflict: "Document update conflict",
  status: 409,
  name: "conflict",
  message: "Document update conflict",
  error: true,
};

const returnDbAllConfirmationObjs = (sentObj) => {
  const confirmations = sentObj.map((itm) => ({
    id: itm._id,
    ...okObj,
  }));
  return confirmations;
};

//TODO: remove it if not needed in the future!
const returnDbLastConflictObj = (sentObj) => {
  const ids = sentObj.map((itm) => itm._id);
  const confirmations = [
    { id: ids[0], ...okObj },
    { id: ids[1], ...okObj },
    { id: ids[2], ...conflictObj },
  ];
  return confirmations;
};

const returnDbNoHashes = () => [];

const returnDbOneHash = () => ["111fakehash2"];

// exportAlbums mocks:
const DBInfoRecordDefault = {
  hash: "111fakehash1",
  fileMetadata: {
    path: "/mnt/g/cs-hardlinks/2019-11-09 09.16.37-0 - AFF-10.jpg",
    stats: {},
    cwd: "/mnt/g/cs-hardlinks",
    crown: "/2019-11-09 09.16.37-0 - AFF-10.jpg",
    parent: "cs-hardlinks",
    isFile: true,
    name: "2019-11-09 09.16.37-0 - AFF-10.jpg",
    ext: ".jpg",
  },
  exif: [
    {
      SourceFile: "/mnt/g/cs-hardlinks/2019-11-09 09.16.37-0 - AFF-10.jpg",
    },
  ],
  importedPath: "/mnt/g/cs-hardlinks/2019-11-09 09.16.37-0 - AFF-10.jpg",
  importedDate: 1591217886008,
  parsedFileName: {
    year: "2019",
    month: "11",
    day: "09",
    time: "09.16.37",
    date: "2019-11-09 09.16.37",
    version: "0",
    comment: "AFF-10.jpg",
  },
  source: "data/images/2019/111fakehash1.jpg",
  sourceSquare: "data/images/2019/111fakehash1_square.jpg",
  _id: "111",
  _rev: "1-111",
};

const returnDbDefaultInfoObj = () => [DBInfoRecordDefault];

module.exports = {
  returnDbAllConfirmationObjs,
  returnDbLastConflictObj,
  returnDbNoHashes,
  returnDbOneHash,
  returnDbDefaultInfoObj,
};
