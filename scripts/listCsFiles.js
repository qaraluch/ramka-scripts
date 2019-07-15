const { walkDir } = require("../src/walker.js");
const { writeFile } = require("../src/writeFile");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";
const outputDirExtended = "../info-extractions/galeria-saved-extended.json";
const outputDirNames = "../info-extractions/galeria-saved-names.json";

(async () => {
  console.log(
    "[ ramka back - script] About to list all files from CS import dir... "
  );
  try {
    const filesListExtended = await walkDir(dirCsImportDir);
    const filesListNames = filesListExtended.map(itm => itm.crown);

    await writeFile(
      outputDirExtended,
      JSON.stringify(filesListExtended, null, 2)
    );

    await writeFile(outputDirNames, JSON.stringify(filesListNames, null, 2));
    console.log("[ Done! ] Saved files to dir: ramka/info-extractions ");
  } catch (error) {
    throw new Error(`Sth. went wrong: ... \n ${error}`);
  }
})();
