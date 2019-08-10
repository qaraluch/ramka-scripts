const jpg = {
  path:
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg",
  stats: {
    dev: 20,
    mode: 33279,
    nlink: 1,
    uid: 1002,
    gid: 1002,
    rdev: 0,
    blksize: 4096,
    ino: 7881299347932306,
    size: 3635695,
    blocks: 7104,
    atimeMs: 1559594844674.7915,
    mtimeMs: 1558265368000,
    ctimeMs: 1559594845380.1567,
    birthtimeMs: 1559594845380.1567,
    atime: "2019-06-03T20:47:24.675Z",
    mtime: "2019-05-19T11:29:28.000Z",
    ctime: "2019-06-03T20:47:25.380Z",
    birthtime: "2019-06-03T20:47:25.380Z",
    isFile: true,
    isDirectory: false,
    isBlockDevice: false,
    isCharacterDevice: false,
    isSymbolicLink: false,
    isFIFO: false,
    isSocket: false
  },
  cwd: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  crown: "/2019-05-19 13.29.28-0 - niedzica.jpg",
  parent: "galeria-saved",
  isFile: true,
  name: "2019-05-19 13.29.28-0 - niedzica.jpg",
  ext: ".jpg"
};

const png = {
  path:
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-04-21 13.05.05-0 - wielkanoc.png",
  stats: {
    dev: 20,
    mode: 33279,
    nlink: 1,
    uid: 1002,
    gid: 1002,
    rdev: 0,
    blksize: 4096,
    ino: 1688849860310679,
    size: 1112799,
    blocks: 2176,
    atimeMs: 1558371865827.7876,
    mtimeMs: 1557948425000,
    ctimeMs: 1558371866273.225,
    birthtimeMs: 1558371866273.225,
    atime: "2019-05-20T17:04:25.828Z",
    mtime: "2019-05-15T19:27:05.000Z",
    ctime: "2019-05-20T17:04:26.273Z",
    birthtime: "2019-05-20T17:04:26.273Z",
    isFile: true,
    isDirectory: false,
    isBlockDevice: false,
    isCharacterDevice: false,
    isSymbolicLink: false,
    isFIFO: false,
    isSocket: false
  },
  cwd: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  crown: "/2019-04-21 13.05.05-0 - wielkanoc.png",
  parent: "galeria-saved",
  isFile: true,
  name: "2019-04-21 13.05.05-0 - wielkanoc.png",
  ext: ".png"
};

const gif = {
  path:
    "/mnt/g/gallery/aadisk-gallery/galeria-saved/2018-01-18 10.10.10-0 - gif - qt-fotomgmt.gif",
  stats: {
    dev: 20,
    mode: 33279,
    nlink: 1,
    uid: 1002,
    gid: 1002,
    rdev: 0,
    blksize: 4096,
    ino: 844424930140042,
    size: 506639,
    blocks: 992,
    atimeMs: 1521484555217.9033,
    mtimeMs: 1520795695000,
    ctimeMs: 1521484555226.9277,
    birthtimeMs: 1521484555226.9277,
    atime: "2018-03-19T18:35:55.218Z",
    mtime: "2018-03-11T19:14:55.000Z",
    ctime: "2018-03-19T18:35:55.227Z",
    birthtime: "2018-03-19T18:35:55.227Z",
    isFile: true,
    isDirectory: false,
    isBlockDevice: false,
    isCharacterDevice: false,
    isSymbolicLink: false,
    isFIFO: false,
    isSocket: false
  },
  cwd: "/mnt/g/gallery/aadisk-gallery/galeria-saved",
  crown: "/2018-01-18 10.10.10-0 - gif - qt-fotomgmt.gif",
  parent: "galeria-saved",
  isFile: true,
  name: "2018-01-18 10.10.10-0 - gif - qt-fotomgmt.gif",
  ext: ".gif"
};

function getCSDifferentFiles() {
  return Promise.resolve([png, gif, jpg]);
}

module.exports = {
  getCSDifferentFiles
};
