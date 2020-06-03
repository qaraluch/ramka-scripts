const rimraf = require("rimraf");

function runManualClean() {
  rimraf("../manual", () => {
    console.log("Removed '../manual' dir!");
  });
}

runManualClean();
