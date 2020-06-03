const { pullAllInfoDB } = require("../src/db");

const dbName = "../.DB-ramka";

describe.skip("db.js", () => {
  it("Should pull all info records form DB (for mock)", async () => {
    const actual = await pullAllInfoDB(dbName);
    console.log(actual[10]);
  });
});
