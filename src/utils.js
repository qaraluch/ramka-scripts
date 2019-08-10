const regexFileName = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\s(?<time>\d{2}\.\d{2}\.\d{2})(-)?(?<version>\d)?(\s)?([-|—])?(\s)?(?<comment>.+)?/;

function parseCSFileName(baseName) {
  const match = regexFileName.exec(baseName);
  const year = match && match.groups.year;
  const month = match && match.groups.month;
  const day = match && match.groups.day;
  const time = match && match.groups.time;
  const date = `${year}-${month}-${day} ${time}`;
  const version = match && match.groups.version;
  const commentRaw = match && match.groups.comment;
  const comment = commentRaw && commentRaw.trim();
  const resultObj = { year, month, day, time, date, version, comment };
  return resultObj;
}

function* generateId(initialValue = 0) {
  let id = initialValue;
  while (true) {
    yield id++;
  }
}

module.exports = {
  parseCSFileName,
  generateId
};
