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
  dryRunDBPut: false
};

async function runApp(commandObj) {
  const { command } = commandObj;
  try {
    if (command === "import") {
      const result = await importMedia(options);
      console.log(result.inputCount);
      console.log(result.outputCount);
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
