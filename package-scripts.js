const { series, concurrent, rimraf } = require("nps-utils");

const cleanNodeModules = rimraf("node_modules");

module.exports = {
  scripts: {
    default: "node index.js",
    debug: {
      default: {
        description: "Run node.js debug",
        script: "node --inspect-brk run.js"
      }
    },
    clear: {
      default: {
        description: "Deletes the `node_modules` directory",
        script: series(cleanNodeModules)
      }
    },
    test: {
      default: {
        description: "jest test",
        script: "./node_modules/.bin/jest"
      }
    },
    listCsFiles: {
      default: {
        description: "list all files in CS import directory",
        script: "node ./scripts/listCsFiles.js"
      }
    }
  },
  options: {
    silent: false
  }
};
