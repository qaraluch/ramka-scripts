const returnDbConfirmationObj = sentObj => {
  const confirmations = sentObj.map(itm => ({
    ok: true,
    id: itm._id,
    rev: "X-XXXXXXXXXXXXXXXXXXXXXX"
  }));
  return confirmations;
};

module.exports = {
  returnDbConfirmationObj
};
