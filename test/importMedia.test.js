const { importMedia } = require("../src/importMedia");

jest.mock("../src/walker", () => {
  const { getCSDifferentFiles } = require("./walkerMock");
  return {
    walkDir: jest.fn(getCSDifferentFiles)
  };
});
//WARN: Mock refers to the real media data on my local computer.
//Path of the exitsting file is used for read hash and exif metadata so
//i don't need to mocki it too.

jest.mock("../src/fs", () => {
  return {
    copyMediaToRamka: jest.fn()
  };
});

jest.mock("../src/talkDB", () => {
  return {
    putNewMediaToDB: jest.fn()
  };
});

describe("importMedia() - integration test", () => {
  it("should import new file to the system", async () => {
    const result = await importMedia();
    // console.log("result ---->", result);
  });
});
