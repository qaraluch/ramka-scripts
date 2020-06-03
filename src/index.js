/* eslint-disable no-console */
const { importMedia } = require("./importMedia");
const { exportAlbums } = require("./exportAlbums");
const { resolveOptions } = require("./utils");

//TODO: add to config.js
const optionsDefault = {
  ramkaHomeDir: "/mnt/h/ramka",
  mediaRepoDir: "data/images",
  // target CS source:
  // mediaImportDir: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  // cs-hardlinks source:
  mediaImportDir: "/mnt/g/cs-hardlinks",
  dbName: "../.DB-ramka",
  albumsDir: "/mnt/h/ramka/albums",
  dryRunCopyMedia: false,
  dryRunDBPut: false,
  limitImport: false,
  loggerOptions: {
    silent: false,
    delimiter: " ramka ",
    disableFileLogs: false,
    logOutputDir: "../logs",
  },
};

function runByCLI(args) {
  const cliCommand = args.input[0];
  const cliPositionalArgs = getPositionalArgs(args.input);
  const cliFlags = args.flags;

  let limitFlag;
  if (cliFlags.limit !== undefined) {
    limitFlag =
      cliFlags.limit === ""
        ? 500 // default --limit cli flag value
        : parseInt(cliFlags.limit);
  }

  const finalOptions = resolveOptions(optionsDefault, {
    limitImport: limitFlag,
  });

  const commandObj = Object.assign(
    {},
    { command: cliCommand },
    { options: finalOptions },
    cliFlags,
    {
      positional: cliPositionalArgs,
    }
  );

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

async function runApp(commandObj) {
  const { command, options } = commandObj;
  try {
    if (command === "import") {
      options.loggerOptions.logFilePrefix = "logs-importMedia"; // rest of file name: -<time-stamp>.log
      await importMedia(options);
    } else if (command === "export-albums") {
      options.loggerOptions.logFilePrefix = "logs-exportAlbums";
      await exportAlbums(options);
    } else {
      console.log("Command not recognized!");
    }
  } catch (error) {
    throw new Error(`index.js - sth. went wrong: ...\n ${error.stack}`);
  }
}

module.exports = {
  runByCLI,
};
