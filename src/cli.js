#!/usr/bin/env node
const { runByCLI } = require("./index.js");
const meow = require("meow");

const options = {};

const args = meow(
  `
	Usage:
    ramka-scripts <command> --flag <value>

    <command> - available commands:
      - import

    1. import - imports media files to the ramka's database.


    Standalone scripts:
    WARN: execute from ramka-scripts home dir!

    $ npm run list-cs-files - lists all files from CS import dir.


  Global options (overrides above)
    --help
    --version
`,
  options
);

runByCLI(args);
