/*eslint no-console: "off"*/
const { walkDir } = require("../src/walker.js");
const { writeFile } = require("../src/writeFile");

const dirCsImportDir = "/mnt/g/gallery/aadisk-gallery/galeria-saved";
const outputDirExtended = "../info-extractions/galeria-saved-extended.json";
const outputDirNames = "../info-extractions/galeria-saved-names.json";

(async () => {
  console.log("[ ramka scripts] list-cs-files");
  console.log(
    "[ ramka scripts] About to list all files from CS import dir... "
  );
  try {
    const fileListExtended = await walkDir(dirCsImportDir);
    const fileListNames = fileListExtended.map((itm) => itm.crown);

    await writeFile(
      outputDirExtended,
      JSON.stringify(fileListExtended, null, 2)
    );

    await writeFile(outputDirNames, JSON.stringify(fileListNames, null, 2));
    console.log("[ Done! ] Saved files to dir: ramka/info-extractions ");
  } catch (error) {
    throw new Error(`Sth. went wrong: ... \n ${error}`);
  }
})();
