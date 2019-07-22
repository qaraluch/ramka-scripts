const { walkDir } = require("../src/walker");

describe.skip("walker.js", () => {
  it("Should walk a import dir and return list of files (for mock)", async () => {
    const actual = await walkDir();
    console.log(actual[0]);
  });
});
