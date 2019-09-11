const { importMedia } = require("../src/importMedia");

// mocked fns and its utils:
const { walkDir } = require("../src/walker");
const { getCSDifferentFiles, getCSSameFiles } = require("./walkerMock");
const {
  getHashFileDifferent,
  getHashFileSame,
  resetHashCounter
} = require("./hashFileMock");
const { hashFile } = require("../src/hashFile");
const { getExif } = require("../src/getExif");
const {
  getExifMockData_jpg,
  getExifMockData_png,
  getExifMockData_gif,
  getExifMockDummy
} = require("./getExifMock");
const { copyFile } = require("../src/copyFile");
const { cropSquareImage } = require("../src/cropSquareImage");
const { putNewMediaToDB, pullAllHashesDB } = require("../src/db");
const {
  returnDbAllConfirmationObjs,
  returnDbLastConflictObj, // for now not need this
  returnDbNoHashes,
  returnDbOneHash
} = require("./dbMock");

jest.mock("../src/walker");
jest.mock("../src/hashFile");
jest.mock("../src/getExif");
jest.mock("../src/copyFile");
jest.mock("../src/cropSquareImage");
jest.mock("../src/db");

jest.mock("../src/db", () => {
  return {
    ...jest.requireActual("../src/db"),
    putNewMediaToDB: jest.fn(),
    pullAllHashesDB: jest.fn()
  };
});

afterEach(() => {
  jest.clearAllMocks();
  resetHashCounter(); // hashFileMock - for each test starts with hash no 0
});

it("should import new file to the system", async () => {
  //Arrange
  //TODO: refactor this
  const t_inputCount = 3;
  const t_Id = "111fakehash2";
  const t_outputPath = "/mnt/h/ramka/data/images/2019/111fakehash2.jpg";
  const t_outputPathSquare =
    "/mnt/h/ramka/data/images/2019/111fakehash2_square.jpg";
  const t_dbSourceImagePath = `data/images/2019/${t_Id}.jpg`;
  walkDir.mockImplementation(getCSDifferentFiles);
  hashFile.mockImplementation(getHashFileDifferent);
  getExif
    .mockReturnValueOnce(getExifMockData_png())
    .mockReturnValueOnce(getExifMockData_gif())
    .mockReturnValueOnce(getExifMockData_jpg())
    .mockReturnValue(
      "no exif data for next mock call... add it to test/getExifMock.js if needed"
    );
  putNewMediaToDB.mockImplementation(returnDbAllConfirmationObjs);
  pullAllHashesDB.mockImplementation(returnDbNoHashes); // simulate no records in DB

  //Act
  const actual = await importMedia();

  //Assert
  // copy default file
  const copyFileSourcePath =
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg";
  const copyFileDestinationPath = t_outputPath;
  expect(copyFile).toHaveBeenCalledTimes(t_inputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    copyFileSourcePath,
    copyFileDestinationPath
  );

  // crop square file
  const cropSquareDestinationPath = t_outputPathSquare;
  expect(cropSquareImage).toHaveBeenCalledTimes(t_inputCount);
  expect(cropSquareImage).toHaveBeenLastCalledWith(
    expect.anything(),
    cropSquareDestinationPath
  );

  // DB
  const expectedRecord = {
    _id: t_Id,
    hash: t_Id,
    exif: [
      expect.objectContaining({
        SourceFile:
          "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg"
      })
    ],
    fileMetadata: expect.objectContaining({ isFile: true }),
    source: t_dbSourceImagePath
  };
  expect(putNewMediaToDB).toHaveBeenCalledTimes(1); // bulkDocs
  expect(putNewMediaToDB).toHaveBeenLastCalledWith(
    expect.arrayContaining([expect.objectContaining(expectedRecord)])
  );

  // return data
  expect(actual.inputCount).toBe(t_inputCount);
  expect(actual.outputCount).toBe(t_inputCount);
});

it("should not import media file when duplicates already exist in the import dir", async () => {
  //Arrange
  const t_inputCount = 2;
  const t_outputCount = 1;
  const t_outputPath = "/mnt/h/ramka/data/images/2019/222fakehashsame0.jpg";
  walkDir.mockImplementation(getCSSameFiles);
  hashFile.mockImplementation(getHashFileSame);
  getExif.mockReturnValue(getExifMockDummy());
  putNewMediaToDB.mockImplementation(returnDbAllConfirmationObjs);
  pullAllHashesDB.mockImplementation(returnDbNoHashes); // simulate no records in DB

  //Act
  const actual = await importMedia();

  //Assert
  // copy default file
  const copyFileSourcePath =
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg";
  const copyFileDestinationPath = t_outputPath;
  expect(copyFile).toHaveBeenCalledTimes(t_outputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    copyFileSourcePath,
    copyFileDestinationPath
  );

  // return data
  expect(actual.inputCount).toBe(t_inputCount);
  expect(actual.outputCount).toBe(t_outputCount);
});

it("should not import media file when duplikates already exist in the Database", async () => {
  //Arrange
  //TODO: refactor this
  const t_inputCount = 3;
  const t_outputCount = 2;
  const t_outputPath = "/mnt/h/ramka/data/images/2018/111fakehash1.gif";
  walkDir.mockImplementation(getCSDifferentFiles);
  hashFile.mockImplementation(getHashFileDifferent);
  getExif.mockReturnValue(getExifMockDummy());
  putNewMediaToDB.mockImplementation(returnDbAllConfirmationObjs);
  pullAllHashesDB.mockImplementation(returnDbOneHash); // simulate 1 record in DB so we can test findDuplicatesInDB()

  //Act
  const actual = await importMedia();

  //Assert
  // copy default file
  const copyFileSourcePath =
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2018-01-18 10.10.10-0 - gif - qt-fotomgmt.gif";
  const copyFileDestinationPath = t_outputPath;
  expect(copyFile).toHaveBeenCalledTimes(t_outputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    copyFileSourcePath,
    copyFileDestinationPath
  );

  // return data
  expect(actual.inputCount).toBe(t_inputCount);
  expect(actual.outputCount).toBe(t_outputCount);
});
