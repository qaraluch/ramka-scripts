#!/usr/bin/env node
const { runByCLI } = require("./index.js");
const meow = require("meow");

const options = {
  flags: {
    limit: {
      type: "string",
      alias: "l",
    },
  },
};

const args = meow(
  `
	Usage:
    ramka-scripts <command> --flag <value>

    <command> - available commands:
      - import
      - export-albums

    1. import - imports media files to the ramka's database.

       -l, --limit [number]        Limit read files number to import.
                                   The newest files is read in the first place.
                                   When the number is not passed it is 500 by default.

    2. export-albums - exports media files from ramka's database to target dir on the disc.

    Standalone npm scripts:
    WARN: execute from ramka-scripts home dir!

    $ npm run list-cs-files                  - lists all files from CS import dir to the files
    $ npm run create-hardlinks-cs            - create source-dir of CS using hardlinks (for development only)
    $ npm run print-log                      - print info from log files of import command (need fzf)
    $ npm run print-log-db-duplicates
    $ npm run print-log-walked-files
    $ npm run print-log-no-date-files
    $ npm run print-log-import-duplicates
    $ npm run print-log-copy-failed
    $ npm run print-log-db-confirmation-failed
    $ npm run print-log-export-albums

  Global options (overrides above)
    --help
    --version
`,
  options
);

// meow API example for reference:
// {
//   input: [ 'import' ],
//   flags: { limit: '10' },
//   unnormalizedFlags: { limit: '10', l: '10' },
//   (...)
// }
runByCLI(args);
