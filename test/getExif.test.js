const { getExif } = require("../src/getExif");

const jpg_path =
  "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg";

const png_path =
  "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-04-21 13.05.05-0 - wielkanoc.png";

const gif_path =
  "/mnt/g/gallery/aadisk-gallery/galeria-saved/2018-01-18 10.10.10-0 - gif - qt-fotomgmt.gif";

it.skip("should get Exif data of files (for mock)", async () => {
  const actual_jpg = await getExif(jpg_path);
  const actual_png = await getExif(png_path);
  const actual_gif = await getExif(gif_path);
  console.log(actual_jpg);
  console.log(actual_png);
  console.log(actual_gif);
});
