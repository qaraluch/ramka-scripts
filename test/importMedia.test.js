const { importMedia } = require("../src/importMedia");

// mocked fns:
const { copyFile } = require("../src/copyFile");
const { putNewMediaToDB } = require("../src/db");

jest.mock("../src/walker", () => {
  const { getCSDifferentFiles } = require("./walkerMock");
  return {
    walkDir: jest.fn(getCSDifferentFiles)
  };
});

jest.mock("../src/hashFile", () => {
  const { generateId } = require("../src/utils");
  let id = generateId();
  return {
    hashFile: jest
      .fn()
      .mockImplementation(() => `111fakehash${id.next().value}`)
  };
});

jest.mock("../src/getExif", () => {
  const {
    getExifMockData_jpg,
    getExifMockData_png,
    getExifMockData_gif
  } = require("./getExifMock");
  return {
    getExif: jest
      .fn()
      .mockReturnValueOnce(getExifMockData_png())
      .mockReturnValueOnce(getExifMockData_gif())
      .mockReturnValueOnce(getExifMockData_jpg())
      .mockReturnValue(
        "no exif data for next mock call... add it to test/getExifMock.js if needed"
      )
  };
});

jest.mock("../src/copyFile", () => {
  return {
    copyFile: jest.fn()
  };
});

jest.mock("../src/cropSquareImage", () => {
  return {
    cropSquareImage: jest.fn()
  };
});

jest.mock("../src/db", () => {
  const returnDbConfirmationObj = obj => {
    const confirmations = obj.map(itm => ({
      ok: true,
      id: itm._id,
      rev: "X-XXXXXXXXXXXXXXXXXXXXXX"
    }));
    return confirmations;
  };
  return {
    ...jest.requireActual("../src/db"),
    putNewMediaToDB: jest.fn(returnDbConfirmationObj)
  };
});

const t_importPath =
  "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg";
const t_outputDir = "/mnt/h/ramka/data/images/2019";
const t_dbSourceDir = "data/images/2019";
const t_Id = "111fakehash2";
const t_outputPath = `${t_outputDir}/${t_Id}.jpg`;
const t_dbSourceImagePath = `${t_dbSourceDir}/${t_Id}.jpg`;

it("should import new file to the system", async () => {
  const t_inputCount = 3;
  const actual = await importMedia();

  // copy default file
  const copyFileSourcePath = t_importPath;
  const copyFileDestinationPath = t_outputPath;
  //TODO: add to tiljs
  expect(copyFile).toHaveBeenCalledTimes(t_inputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    copyFileSourcePath,
    copyFileDestinationPath
  );

  // crop square file
  const cropSquareDestinationPath = t_outputPath;
  expect(copyFile).toHaveBeenCalledTimes(t_inputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    expect.anything(),
    cropSquareDestinationPath
  );

  // DB
  const expectedRecord = {
    _id: t_Id,
    hash: t_Id,
    exif: [expect.objectContaining({ SourceFile: t_importPath })],
    fileMetadata: expect.objectContaining({ isFile: true }),
    source: t_dbSourceImagePath
  };
  expect(copyFile).toHaveBeenCalledTimes(t_inputCount);
  expect(putNewMediaToDB).toHaveBeenLastCalledWith(
    expect.arrayContaining([expect.objectContaining(expectedRecord)])
  );

  // return data
  expect(actual.inputCount).toBe(3);
  expect(actual.outputCount).toBe(3);
});

it.skip("should not import media file when already exists in the system", async () => {
  const actual = await importMedia();
  // return data
  //TODO: iplement it!
});
