const { walkDir } = require("../src/walker");
const { readFilesInfos } = require("../src/readFilesInfos");

jest.mock("../src/walker", () => {
  const { getCSDifferentFiles } = require("./walkerMock");
  return {
    walkDir: jest.fn(getCSDifferentFiles)
  };
});
//WARN: Mock refers to the real media data on my local computer.
//Path of the exitsting file is used for read hash and exif metadata so
//i don't need to mocki it too.

describe.skip("readFilesInfos()", () => {
  it("should return info read for imported media file", async () => {
    //TODO: add integration test...
    //For now only for get proper formated data object.
    const readInfo = await readFilesInfos();
    console.log(readInfo);
  });
});
