const chalk = require("chalk");
const figlet = require("figlet");
const { Signale } = require("signale");
const { resolveOptions } = require("./utils");
const ProgressBar = require("progress");

const path = require("path");
const bunyan = require("bunyan");
const makeDir = require("make-dir");
const { getFileTimeStamp } = require("./utils.js");

const defaultUiLoggerOptions = {
  silent: false,
  delimiter: "",
};

const defaultFileLoggerOptions = {
  disableFileLogs: false,
  level: "trace",
  logOutputDir: ".",
  logFilePrefix: "logs", // rest of file name: -<time-stamp>.log
};

const configSignaleNoDecorations = {
  displayLabel: false,
  displayBadge: false,
  displayScope: false,
  types: {
    space: {
      badge: null,
      color: null,
      label: null,
    },
  },
};

function constructFinalOptions(inputOptions) {
  const {
    loggerOptions = {},
    signaleOptions = {},
    bunyanOptions = {},
  } = inputOptions;
  const endLoggerOptions = resolveOptions(
    defaultUiLoggerOptions,
    defaultFileLoggerOptions,
    loggerOptions
  );
  const resultOptions = resolveOptions(
    endLoggerOptions,
    {
      scope: endLoggerOptions.delimiter, //Signale API
      disabled: endLoggerOptions.silent, //Signale API
    },
    signaleOptions,
    {
      name: endLoggerOptions.delimiter, //Bunyan API
      streams: setUpBunyanStream(
        endLoggerOptions.disableFileLogs,
        endLoggerOptions.logOutputDir,
        endLoggerOptions.logFilePrefix
      ),
    },
    bunyanOptions
  );
  return resultOptions;
}

// Signale logger as UI logger
function initUiLogger(options = {}) {
  const uiLogger = new Signale(options);
  return {
    it: itUi(uiLogger),
    done: done(uiLogger),
    error: error(uiLogger),
    welcome: welcome(uiLogger),
    time: time(uiLogger),
    timeEnd: timeEnd(uiLogger),
    readFilesIn: readFilesIn(uiLogger),
    readFilesCount: readFilesCount(uiLogger),
    foundDbDuplicates: foundDbDuplicates(uiLogger),
    foundExifErrors: foundExifErrors(uiLogger),
    foundNoDateFiles: foundNoDateFiles(uiLogger),
    foundImportDuplicates: foundImportDuplicates(uiLogger),
    foundCopyFailed: foundCopyFailed(uiLogger),
    foundDBPutFaild: foundDBPutFaild(uiLogger),
    importedFilesCount: importedFilesCount(uiLogger),
  };
}

// Bunyan logger as File logger
async function initFileLogger(options = {}) {
  const { level, logOutputDir } = options;
  if (!options.disableFileLogs) {
    await makeLogDir(logOutputDir);
  }
  const fileLogger = bunyan.createLogger(options);
  const ringbuffer = new bunyan.RingBuffer({ limit: 10000000 });
  fileLogger.addStream({
    type: "raw",
    stream: ringbuffer,
    level: level,
  });
  const returnRingbuffer = (reducerCb) => {
    const rec = ringbuffer.records;
    if (typeof reducerCb === "function") {
      return rec.reduce(reducerCb, []);
    } else {
      return rec;
    }
  };
  return {
    _returnLogs: returnRingbuffer,
    //pass reducer function to extract data; if not returns raw data
    it: itFile(fileLogger),
  };
}

async function makeLogDir(logOutputDir) {
  try {
    await makeDir(logOutputDir);
  } catch (error) {
    throw new Error(
      `logger.js - initFileLogger() - While init logger: make dir for log files failed: ${error}`
    );
  }
}

const resolveLogOutputPath = (logOutputDir, logFilePrefix) =>
  path.resolve(logOutputDir, `${logFilePrefix}-${getFileTimeStamp()}.log`);

const setUpBunyanStream = (disableFileLogs, logOutputDir, logFilePrefix) => {
  //API Bunyan
  if (disableFileLogs) {
    return [];
  } else {
    return [{ path: resolveLogOutputPath(logOutputDir, logFilePrefix) }];
  }
};

async function initLogger(globalLoggerOptions) {
  const finalOptions = constructFinalOptions(globalLoggerOptions);
  return {
    log: initUiLogger(finalOptions),
    logFile: await initFileLogger(finalOptions),
  };
}

function initProgressBarBasic(options) {
  const ttyWidth = process.stdout.columns - 20;
  const { total = 50, msg = "default msg", width = ttyWidth } = options;
  return new ProgressBar(`>> ${msg} [:bar] :percent [:etas] `, {
    complete: "=",
    incomplete: " ",
    clear: true,
    total,
    width,
  });
}

// Helpers:
const colorWith = (color) => (msg) => `${chalk[color](msg)}`;
const addTab = () => " ".repeat(4);

const displayBanner = (logger, bannerTxt) => {
  const newLogger = logger.scope("");
  newLogger.config(configSignaleNoDecorations);
  newLogger.log(bannerTxt);
};

const putSpace = (uiLogger, spaces = 1) => {
  const newLogger = uiLogger.scope("");
  newLogger.config(configSignaleNoDecorations);
  newLogger.log("\n".repeat(spaces));
};

// MSGs: basic
const itUi = (uiLogger) => (msg) => uiLogger.log(msg);
const done = (uiLogger) => () => uiLogger.success(colorWith("green")("DONE!"));
const error = (uiLogger) => (msg) => uiLogger.error(msg);
const time = (uiLogger) => (label) => uiLogger.time(label);
const timeEnd = (uiLogger) => (label) => uiLogger.timeEnd(label);

const welcome = (uiLogger) => () => {
  uiLogger.log("Welcome to:");
  displayBanner(
    uiLogger,
    colorWith("green")(`\n${figlet.textSync("RAMKA", "big")}`)
  );
  displayBanner(
    uiLogger,
    colorWith("gray")("                     SCRIPTS - importMedia")
  );
  putSpace(uiLogger, 1);
};

// MSGs: basic operations
const readFilesIn = (uiLogger) => (filePath) =>
  uiLogger.log(`Reading files in dir: ${filePath}`);

const readFilesCount = (uiLogger) => (number) =>
  uiLogger.log(`${addTab()}... read: ${colorWith("yellow")(number)} files`);

// MSGs: app specific
const foundDbDuplicates = (uiLogger) => (number) =>
  uiLogger.warn(
    `Found duplicates in Database: ${colorWith("yellow")(
      number
    )} files (see log file)`
  );

const foundExifErrors = (uiLogger) => (number) =>
  uiLogger.warn(
    `Found exif errors: ${colorWith("yellow")(number)} files (see log file)`
  );

const foundNoDateFiles = (uiLogger) => (number) =>
  uiLogger.warn(
    `Found files with no date: ${colorWith("yellow")(
      number
    )} files (see log file)`
  );

const foundImportDuplicates = (uiLogger) => (number) =>
  uiLogger.warn(
    `Found duplicate files in the import dir: ${colorWith("yellow")(
      number
    )} files (see log file)`
  );

const foundCopyFailed = (uiLogger) => (number) =>
  uiLogger.warn(
    `Found copy failed: ${colorWith("yellow")(number)} files (see log file)`
  );

const foundDBPutFaild = (uiLogger) => (number) =>
  uiLogger.warn(
    `Found database update failures: ${colorWith("yellow")(
      number
    )} files (see log file)`
  );

const importedFilesCount = (uiLogger) => (number) =>
  uiLogger.log(`Imported: ${number} files`);

// MSGs: to log file
const itFile = (fileLogger) => {
  return (msg, property, obj) => {
    fileLogger.info({ [property]: obj }, msg);
  };
};

module.exports = {
  initLogger,
  initProgressBarBasic,
};
