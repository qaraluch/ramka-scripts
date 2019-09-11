const okObj = {
  ok: true,
  rev: "X-XXXXXXXXXXXXXXXXXXXXXX"
};

const conflictObj = {
  conflict: "Document update conflict",
  status: 409,
  name: "conflict",
  message: "Document update conflict",
  error: true
};

const returnDbAllConfirmationObjs = sentObj => {
  const confirmations = sentObj.map(itm => ({
    id: itm._id,
    ...okObj
  }));
  return confirmations;
};

//TODO: remove it if not needed in the future!
const returnDbLastConflictObj = sentObj => {
  const ids = sentObj.map(itm => itm._id);
  const confirmations = [
    { id: ids[0], ...okObj },
    { id: ids[1], ...okObj },
    { id: ids[2], ...conflictObj }
  ];
  return confirmations;
};

const returnDbNoHashes = () => [];

const returnDbOneHash = () => ["111fakehash2"];

module.exports = {
  returnDbAllConfirmationObjs,
  returnDbLastConflictObj,
  returnDbNoHashes,
  returnDbOneHash
};
