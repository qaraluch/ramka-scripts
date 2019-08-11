const { calculateOutputPaths } = require("../src/fs");

const fakeFileList = [
  {
    hash: "d6ad7a969dd1d573b8e6335d6d5fc154",
    exif: { data: [], error: null },
    importedPath:
      "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg",
    fileMetadata: {
      stats: [],
      cwd: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
      crown: "/2019-05-19 13.29.28-0 - niedzica.jpg",
      parent: "galeria-saved",
      isFile: true,
      name: "2019-05-19 13.29.28-0 - niedzica.jpg",
      ext: ".jpg"
    }
  }
];

describe("calculateOutputPaths()", () => {
  it("should calculate file name and output file path imported to the system ", () => {
    const actual = calculateOutputPaths(fakeFileList)[0];
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
});
