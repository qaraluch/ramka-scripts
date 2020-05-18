/*eslint no-console: "off"*/
const { walkDir } = require("../src/walker.js");
const { writeFile } = require("../src/writeFile");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";
const outputDirExtended = "../info/galeria-saved-full.json";
const outputDirNames = "../info/galeria-saved-names.json";
const outputDirPaths = "../info/galeria-saved-paths.json";

(async () => {
  console.log("[ ramka scripts] list-cs-files");
  console.log(
    "[ ramka scripts] About to list all files from CS import dir... "
  );
  try {
    const fileListExtended = await walkDir(dirCsImportDir);
    const fileListNames = fileListExtended.map((itm) => itm.name);
    const fileListPaths = fileListExtended.map((itm) => itm.path);

    //TODO: write file do not creaate dir if not exists, add this feature
    // see: tiljs-tolearn.md
    await writeFile(
      outputDirExtended,
      JSON.stringify(fileListExtended, null, 2)
    );
    await writeFile(outputDirNames, JSON.stringify(fileListNames, null, 2));
    await writeFile(outputDirPaths, JSON.stringify(fileListPaths, null, 2));

    console.log("[ Done! ] Saved files to dir: ramka/info ");
  } catch (error) {
    throw new Error(`Sth. went wrong: ... \n ${error}`);
  }
})();
