const { exportAlbums } = require("../src/exportAlbums");

//TODO: add to config.js
const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  dbName: "../.DB-ramka",
  albumsDir: "/mnt/h/ramka/albums",
  loggerOptions: {
    silent: true,
    delimiter: " ramka ",
    disableFileLogs: true,
    logOutputDir: "./logs",
    logFilePrefix: "logs", // rest of file name: -<time-stamp>.log
  },
};

// mocked fns and its utils:
const { returnDbDefaultInfoObj } = require("./dbMock");

const { pullAllInfoDB } = require("../src/db");
const { createHardLink } = require("../src/createHardLink");
const rimraf = require("rimraf");

jest.mock("../src/db", () => {
  return {
    ...jest.requireActual("../src/db"),
    pullAllInfoDB: jest.fn(),
  };
});
jest.mock("../src/createHardLink");
jest.mock("rimraf");

afterEach(() => {
  jest.clearAllMocks();
});

it("should export photos to the album dir", async () => {
  //Arrange
  const t_Id = "111fakehash1";
  const t_sourcePath = `${options.ramkaHomeDir}/data/images/2019/${t_Id}.jpg`;
  const t_destinationPath = `${options.albumsDir}/all/2019-11-09-09.16.37-0-AFF-10.jpg`;

  pullAllInfoDB.mockImplementation(returnDbDefaultInfoObj);

  //Act
  const actual = await exportAlbums(options);

  //Assert
  // createHardlinks files
  const hardlinkFileSourcePath = t_sourcePath;
  const hardlinkFileDestinationPath = t_destinationPath;
  expect(createHardLink).toHaveBeenNthCalledWith(
    1,
    hardlinkFileSourcePath,
    hardlinkFileDestinationPath
  );

  // return data
  expect(actual).toEqual(expect.arrayContaining([["all", 1]]));
});
