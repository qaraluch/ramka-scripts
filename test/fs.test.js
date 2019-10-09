const { calculateOutputPaths, filterOutCopyFailed } = require("../src/fs");

const fakeFileList = [
  {
    hash: "d6ad7a969dd1d573b8e6335d6d5fc154",
    exif: { data: [], error: null },
    importedPath:
      "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg",
    fileMetadata: {
      name: "2019-05-19 13.29.28-0 - niedzica.jpg",
      ext: ".jpg"
    }
  }
];

const options = {
  ramkaHomeDir: "/mnt/h/ramka",
  mediaRepoDir: "data/images"
};

it("calculateOutputPaths() - should calculate file name and output file path imported to the system ", () => {
  const actual = calculateOutputPaths(
    fakeFileList,
    options.mediaRepoDir,
    options.ramkaHomeDir
  )[0][0];
  const expectedHomeDir = "/mnt/h/ramka";
  const expectedDir = "data/images";
  const expectedYear = "2019";
  const expectedMain = "d6ad7a969dd1d573b8e6335d6d5fc154.jpg";
  const expectedSquare = "d6ad7a969dd1d573b8e6335d6d5fc154_square.jpg";
  expect(actual.outputHomeDir).toBe(expectedHomeDir);
  expect(actual.outputDir).toBe(expectedDir);
  expect(actual.outputYear).toBe(expectedYear);
  expect(actual.outputFileName).toBe(expectedMain);
  expect(actual.outputFileNameSquare).toBe(expectedSquare);
});

const filesList = [
  {
    name: "2019-05-19 13.29.28-0 - niedzica.jpg"
  },
  {
    name: "2019-05-19 13.29.28-1 - niedzica.jpg"
  },
  {
    name: "2019-05-19 13.29.28-2 - niedzica.jpg"
  },
  {
    name: "2019-05-19 13.29.28-3 - niedzica.jpg"
  }
];

const filesListResultGood = [
  {
    name: "2019-05-19 13.29.28-0 - niedzica.jpg",
    copySuccess: true,
    cropSuccess: true,
    copyErrorMsg: false,
    cropErrorMsg: false
  }
];

const filesListResultFailed = [
  {
    name: "2019-05-19 13.29.28-1 - niedzica.jpg",
    copySuccess: false,
    cropSuccess: true,
    copyErrorMsg: "Error: copy failed",
    cropErrorMsg: false
  },
  {
    name: "2019-05-19 13.29.28-2 - niedzica.jpg",
    copySuccess: true,
    cropSuccess: false,
    copyErrorMsg: false,
    cropErrorMsg: "Error: crop failed"
  },
  {
    name: "2019-05-19 13.29.28-3 - niedzica.jpg",
    copySuccess: false,
    cropSuccess: false,
    copyErrorMsg: "Error: copy failed",
    cropErrorMsg: "Error: crop failed"
  }
];

const copyResults = [
  // [errorCp, resultCp, errorCrop, resultCrop];
  [false, true, false, true],
  ["Error: copy failed", false, false, true],
  [false, true, "Error: crop failed", false],
  ["Error: copy failed", false, "Error: crop failed", false]
];

it("filterOutCopyFailed() - should filter out filesList array based on result of copy and crop operation", () => {
  const [actualGood, actualFailed] = filterOutCopyFailed(
    filesList,
    copyResults
  );
  expect(actualGood.length).toBe(1);
  expect(actualFailed.length).toBe(3);
  expect(actualGood).toEqual(filesListResultGood);
  expect(actualFailed).toEqual(filesListResultFailed);
});
