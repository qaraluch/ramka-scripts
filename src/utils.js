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

function resolveOptions(defaultOptions, ...options) {
  const optionsMapper = (opt) =>
    Object.entries(opt)
      .filter(([_, value]) => typeof value !== "undefined")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  const endOptions = Object.assign(
    {},
    defaultOptions,
    ...options.map(optionsMapper)
  );
  return endOptions;
}

function getDate(passedDate) {
  const currentDate = new Date();
  const currentDateMs = currentDate.getTime();
  const passedDateValue = new Date(passedDate).getTime();
  const timeZoneOffsetMs = currentDate.getTimezoneOffset() * 60 * 1000;
  const theDate = new Date(
    (passedDateValue || currentDateMs) - timeZoneOffsetMs
  );
  return theDate.toISOString();
}

const getFileTimeStamp = (passDateValue) =>
  // form: 2018-07-10T09:29:13.636Z -> 2018-07-10_092922
  getDate(passDateValue)
    .replace(/T/, "_")
    .replace(/:/g, "")
    .replace(/\..+/, "");

module.exports = {
  resolveOptions,
  getFileTimeStamp,
  parseCSFileName,
  generateId,
};
