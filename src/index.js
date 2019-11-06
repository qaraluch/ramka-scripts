const { importMedia } = require("./importMedia");

function runByCLI(args) {
  const cliCommand = args.input[0];
  const cliPositionalArgs = getPositionalArgs(args.input);
  const cliFlags = args.flags;
  const commandObj = Object.assign({}, { command: cliCommand }, cliFlags, {
    positional: cliPositionalArgs
  });
  if (cliCommand === undefined) {
    args.showHelp();
  } else {
    runApp(commandObj);
  }
}

function getPositionalArgs(input) {
  const positional = input.slice(1);
  return positional.length == 0 ? undefined : positional;
}

//TODO: add to config.js
const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  mediaRepoDir: "data/images",
  mediaImportDir: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  dbName: "../.DB-ramka",
  dryRunCopyMedia: true,
  dryRunDBPut: false,
  limitImport: false,
  loggerOptions: {
    silent: false,
    delimiter: " ramka ",
    disableFileLogs: false,
    logOutputDir: "../logs",
    logFilePrefix: "logs-importMedia" // rest of file name: -<time-stamp>.log
  }
};

async function runApp(commandObj) {
  const { command } = commandObj;
  try {
    if (command === "import") {
      await importMedia(options);
    } else {
      console.log("Command not recognized!");
    }
  } catch (error) {
    throw new Error(`index.js - sth. went wrong: ...\n ${error.stack}`);
  }
}

module.exports = {
  runByCLI
};
