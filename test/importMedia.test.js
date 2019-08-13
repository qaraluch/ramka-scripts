const { importMedia } = require("../src/importMedia");

// mocked fns and its utils:
const { walkDir } = require("../src/walker");
const { getCSDifferentFiles, getCSSameFiles } = require("./walkerMock");
const { getHashFileDifferent, getHashFileSame } = require("./hashFileMock");
const { hashFile } = require("../src/hashFile");
const { getExif } = require("../src/getExif");
const {
  getExifMockData_jpg,
  getExifMockData_png,
  getExifMockData_gif
} = require("./getExifMock");
const { copyFile } = require("../src/copyFile");
const { cropSquareImage } = require("../src/cropSquareImage");
const { putNewMediaToDB } = require("../src/db");
const { returnDbConfirmationObj } = require("./dbMock");

jest.mock("../src/walker");
jest.mock("../src/hashFile");
jest.mock("../src/getExif");
jest.mock("../src/copyFile");
jest.mock("../src/cropSquareImage");
jest.mock("../src/db");

jest.mock("../src/db", () => {
  return {
    ...jest.requireActual("../src/db"),
    putNewMediaToDB: jest.fn()
  };
});

const t_Id = "111fakehash2";
const t_outputPath = "/mnt/h/ramka/data/images/2019/111fakehash2.jpg";
const t_outputPathSquare =
  "/mnt/h/ramka/data/images/2019/111fakehash2_square.jpg";
const t_dbSourceImagePath = `data/images/2019/${t_Id}.jpg`;

it("should import new file to the system", async () => {
  //Arrange
  const t_inputCount = 3;
  walkDir.mockImplementation(getCSDifferentFiles);
  hashFile.mockImplementation(getHashFileDifferent);
  getExif
    .mockReturnValueOnce(getExifMockData_png())
    .mockReturnValueOnce(getExifMockData_gif())
    .mockReturnValueOnce(getExifMockData_jpg())
    .mockReturnValue(
      "no exif data for next mock call... add it to test/getExifMock.js if needed"
    );
  putNewMediaToDB.mockImplementation(returnDbConfirmationObj);

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

it.skip("should not import media file when already exists in the system", async () => {
  //Arrange
  const t_inputCount = 2;
  const t_outputCount = 1;
  walkDir.mockImplementation(getCSSameFiles);
  hashFile.mockImplementation(getHashFileSame);

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
  expect(actual.outputCount).toBe(t_outputCount);
});
