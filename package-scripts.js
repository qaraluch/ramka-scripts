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
    }
  },
  options: {
    silent: false
  }
};
