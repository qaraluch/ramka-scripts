const { importMedia } = require("../src/importMedia");

//TODO: add to config.js
const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  mediaRepoDir: "data/images",
  mediaImportDir: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  dbName: ".DB-ramka",
  dryRunCopyMedia: false,
  dryRunDBPut: false
};

// mocked fns and its utils:
const {
  getCSDifferentFiles,
  getCSSameFiles,
  getCSFilesWithNoDate
} = require("./walkerMock");
const {
  getHashFileDifferent,
  getHashFileSame,
  resetHashCounter
} = require("./hashFileMock");
const {
  getExifMockData_jpg,
  getExifMockData_png,
  getExifMockData_gif,
  getExifMockDummy
} = require("./getExifMock");
const {
  returnDbAllConfirmationObjs,
  returnDbLastConflictObj, // for now not need this
  returnDbNoHashes,
  returnDbOneHash
} = require("./dbMock");

const {
  copyFileMockImplNormal,
  copyFileMockImplThrow,
  cropSquareImageMockImplNormal,
  cropSquareImageMockImplThrow
} = require("./fsMock");

const { walkDir } = require("../src/walker");
const { hashFile } = require("../src/hashFile");
const { getExif } = require("../src/getExif");
const { cropSquareImage } = require("../src/cropSquareImage");
const { copyFile } = require("../src/copyFile");
const { putNewMediaToDB, pullAllHashesDB } = require("../src/db");

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
  const t_inputCount = 3;
  const t_Id = "111fakehash2";
  const t_inputPath =
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg";
  const t_outputPath = `/mnt/h/ramka/data/images/2019/${t_Id}.jpg`;
  const t_outputPathSquare = `/mnt/h/ramka/data/images/2019/${t_Id}_square.jpg`;
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
  copyFile.mockImplementation(copyFileMockImplNormal);
  cropSquareImage.mockImplementation(cropSquareImageMockImplNormal);

  //Act
  const actual = await importMedia(options);

  //Assert
  // copy default file
  const copyFileSourcePath = t_inputPath;
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
        SourceFile: t_inputPath
      })
    ],
    fileMetadata: expect.objectContaining({ isFile: true }),
    source: t_dbSourceImagePath
  };
  expect(putNewMediaToDB).toHaveBeenCalledTimes(1); // bulkDocs
  expect(putNewMediaToDB).toHaveBeenLastCalledWith(
    expect.arrayContaining([expect.objectContaining(expectedRecord)]),
    expect.anything()
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
  const t_inputPath =
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg";
  walkDir.mockImplementation(getCSSameFiles);
  hashFile.mockImplementation(getHashFileSame);
  getExif.mockReturnValue(getExifMockDummy());
  putNewMediaToDB.mockImplementation(returnDbAllConfirmationObjs);
  pullAllHashesDB.mockImplementation(returnDbNoHashes); // simulate no records in DB
  copyFile.mockImplementation(copyFileMockImplNormal);
  cropSquareImage.mockImplementation(cropSquareImageMockImplNormal);

  //Act
  const actual = await importMedia(options);

  //Assert
  // copy default file
  const copyFileSourcePath = t_inputPath;
  const copyFileDestinationPath = t_outputPath;
  expect(copyFile).toHaveBeenCalledTimes(t_outputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    copyFileSourcePath,
    copyFileDestinationPath
  );

  // return data
  expect(actual.inputCount).toBe(t_inputCount);
  expect(actual.outputCount).toBe(t_outputCount);
  expect(actual.filesListDuplicatesImport.length).toBe(1);
  const expectedRecord = { hash: "222fakehashsame0" };
  expect(actual.filesListDuplicatesImport).toEqual(
    expect.arrayContaining([expect.objectContaining(expectedRecord)])
  );
});

it("should not import media file when duplikates already exist in the Database", async () => {
  //Arrange
  const t_inputCount = 3;
  const t_outputCount = 2;
  const t_outputPath = "/mnt/h/ramka/data/images/2018/111fakehash1.gif";
  const t_inputPath =
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2018-01-18 10.10.10-0 - gif - qt-fotomgmt.gif";
  walkDir.mockImplementation(getCSDifferentFiles);
  hashFile.mockImplementation(getHashFileDifferent);
  getExif.mockReturnValue(getExifMockDummy());
  putNewMediaToDB.mockImplementation(returnDbAllConfirmationObjs);
  pullAllHashesDB.mockImplementation(returnDbOneHash); // simulate 1 record in DB so we can test findDuplicatesInDB()
  copyFile.mockImplementation(copyFileMockImplNormal);
  cropSquareImage.mockImplementation(cropSquareImageMockImplNormal);

  //Act
  const actual = await importMedia(options);

  //Assert
  // copy default file
  const copyFileSourcePath = t_inputPath;
  const copyFileDestinationPath = t_outputPath;
  expect(copyFile).toHaveBeenCalledTimes(t_outputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    copyFileSourcePath,
    copyFileDestinationPath
  );

  // return data
  expect(actual.inputCount).toBe(t_inputCount);
  expect(actual.outputCount).toBe(t_outputCount);
  expect(actual.filesListDuplicatesDB.length).toBe(1);
  const expectedRecord = { hash: "111fakehash2" };
  expect(actual.filesListDuplicatesDB).toEqual(
    expect.arrayContaining([expect.objectContaining(expectedRecord)])
  );
});

it("should not deal with media file when can not parse year from its filename date", async () => {
  //Arrange
  const t_inputCount = 2;
  const t_outputCount = 2;
  const t_outputPath = "/mnt/h/ramka/data/images/beforeTime/111fakehash1.jpg";
  const t_inputPath =
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/1990 - jakas fotka.jpg";
  walkDir.mockImplementation(getCSFilesWithNoDate);
  hashFile.mockImplementation(getHashFileDifferent);
  getExif.mockReturnValue(getExifMockDummy());
  putNewMediaToDB.mockImplementation(returnDbAllConfirmationObjs);
  pullAllHashesDB.mockImplementation(returnDbNoHashes); // simulate no records in DB
  copyFile.mockImplementation(copyFileMockImplNormal);
  cropSquareImage.mockImplementation(cropSquareImageMockImplNormal);

  //Act
  const actual = await importMedia(options);

  //Assert
  // copy default file
  const copyFileSourcePath = t_inputPath;
  const copyFileDestinationPath = t_outputPath;
  expect(copyFile).toHaveBeenCalledTimes(t_outputCount);
  expect(copyFile).toHaveBeenLastCalledWith(
    copyFileSourcePath,
    copyFileDestinationPath
  );

  // return data
  expect(actual.inputCount).toBe(t_inputCount);
  expect(actual.outputCount).toBe(t_outputCount);
  expect(actual.filesListNoDates.length).toBe(1);
  const expectedRecord = { hash: "111fakehash1" };
  expect(actual.filesListNoDates).toEqual(
    expect.arrayContaining([expect.objectContaining(expectedRecord)])
  );
});

it("should filter out media item from putting to DB when copyFile and cropSquareImage fails", async () => {
  //Arrange
  const t_inputCount = 3;
  const t_outputCount = 1;
  walkDir.mockImplementation(getCSDifferentFiles);
  hashFile.mockImplementation(getHashFileDifferent);
  getExif.mockReturnValue(getExifMockDummy());
  pullAllHashesDB.mockImplementation(returnDbNoHashes); // simulate no records in DB
  putNewMediaToDB.mockImplementation(returnDbAllConfirmationObjs);
  copyFile
    .mockImplementationOnce(copyFileMockImplNormal)
    .mockImplementationOnce(copyFileMockImplThrow)
    .mockImplementation(copyFileMockImplNormal);
  cropSquareImage
    .mockImplementationOnce(cropSquareImageMockImplNormal)
    .mockImplementationOnce(cropSquareImageMockImplNormal)
    .mockImplementation(cropSquareImageMockImplThrow);

  //Act
  const actual = await importMedia(options);

  //DB put calls
  expect(putNewMediaToDB).toHaveBeenCalledTimes(1); // bulkDocs
  const expectedRecord = { _id: "111fakehash0" };
  expect(putNewMediaToDB).toHaveBeenLastCalledWith(
    expect.arrayContaining([expect.objectContaining(expectedRecord)]),
    expect.anything()
  );
  const putNewMediaToDBCall = putNewMediaToDB.mock.calls[0];
  expect(putNewMediaToDBCall[0].length).toBe(1); //check if fn is called with first argument that has length = 1

  // return data
  expect(actual.inputCount).toBe(t_inputCount);
  expect(actual.outputCount).toBe(t_outputCount);
  expect(actual.filesListCopyFailed.length).toBe(2);
  const expectedRecord2 = { hash: "111fakehash1" };
  const expectedRecord3 = { hash: "111fakehash2" };
  expect(actual.filesListCopyFailed).toEqual(
    expect.arrayContaining([
      expect.objectContaining(expectedRecord2),
      expect.objectContaining(expectedRecord3)
    ])
  );
});
