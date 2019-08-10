const jpg_exif = {
  data: [
    {
      SourceFile:
        "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-05-19 13.29.28-0 - niedzica.jpg",
      ExifToolVersion: 10.53,
      ModifyDate: "2019:05:19 13:29:28",
      GPSAltitudeRef: "Above Sea Level",
      Model: "LG-H930",
      YCbCrPositioning: "Centered",
      ResolutionUnit: "inches",
      YResolution: 72,
      Orientation: "Horizontal (normal)",
      ColorSpace: "sRGB",
      FNumber: 1.6,
      CreateDate: "2019:05:19 13:29:28",
      FocalLength: "4.0 mm",
      ExposureMode: "Auto",
      SubSecTimeDigitized: "003945",
      ExifImageHeight: 2620,
      SceneCaptureType: "Standard",
      SceneType: "Directly photographed",
      SubSecTimeOriginal: "003945",
      DigitalZoomRatio: 1,
      ExposureProgram: "Not Defined",
      WhiteBalance: "Auto",
      ExifImageWidth: 4656,
      SubSecTime: "003945",
      ShutterSpeedValue: "1/1518",
      MeteringMode: "Center-weighted average",
      DateTimeOriginal: "2019:05:19 13:29:28",
      UserComment:
        "0   AC EffectRange(2.0) enhenced_scale(1.1) enhenced_level(-13) isOutdoor(1) result(0) FM0 CR1.04 Prymid0 maxDarkArea0.00 maxBrightArea0.00 maxPeakNotSat0.00 lns52.0 FC000000000bfalic 0000X",
      ComponentsConfiguration: "Y, Cb, Cr, -",
      ExifVersion: "0220",
      Flash: "Off, Did not fire",
      InteropIndex: "R98 - DCF basic file (sRGB)",
      InteropVersion: "0100",
      ExposureCompensation: "+1",
      BrightnessValue: 0,
      ISO: 50,
      SensingMethod: "One-chip color area",
      FlashpixVersion: "0100",
      Warning: "[minor] Unrecognized MakerNotes",
      ExposureTime: "1/1519",
      XResolution: 72,
      Make: "LG Electronics",
      ThumbnailLength: 9386,
      ThumbnailOffset: 6610,
      Compression: "JPEG (old-style)",
      Aperture: 1.6,
      GPSAltitude: "0 m Above Sea Level",
      ImageSize: "4656x2620",
      Megapixels: 12.2,
      ShutterSpeed: "1/1519",
      SubSecCreateDate: "2019:05:19 13:29:28.003945",
      SubSecDateTimeOriginal: "2019:05:19 13:29:28.003945",
      SubSecModifyDate: "2019:05:19 13:29:28.003945",
      ThumbnailImage: "(Binary data 9386 bytes, use -b option to extract)",
      FocalLength35efl: "4.0 mm",
      LightValue: 12.9
    }
  ],
  error: null
};

const png_exif = {
  data: [
    {
      SourceFile:
        "/mnt/g/gallery/aadisk-gallery/galeria-saved/2019-04-21 13.05.05-0 - wielkanoc.png",
      ExifToolVersion: 10.53,
      ImageWidth: 672,
      ImageHeight: 1280,
      BitDepth: 8,
      ColorType: "RGB",
      Compression: "Deflate/Inflate",
      Filter: "Adaptive",
      Interlace: "Noninterlaced",
      ImageSize: "672x1280",
      Megapixels: 0.86
    }
  ],
  error: null
};

const gif_exif = {
  data: [
    {
      SourceFile:
        "/mnt/g/gallery/aadisk-gallery/galeria-saved/2018-01-18 10.10.10-0 - gif - qt-fotomgmt.gif",
      ExifToolVersion: 10.53,
      GIFVersion: "89a",
      ImageWidth: 786,
      ImageHeight: 536,
      HasColorMap: "No",
      ColorResolutionDepth: 8,
      BitsPerPixel: 8,
      BackgroundColor: 0,
      AnimationIterations: "Infinite",
      FrameCount: 38,
      Duration: "6.96 s",
      ImageSize: "786x536",
      Megapixels: 0.421
    }
  ],
  error: null
};

function getExifMockData_jpg() {
  return Promise.resolve(jpg_exif);
}

function getExifMockData_png() {
  return Promise.resolve(png_exif);
}

function getExifMockData_gif() {
  return Promise.resolve(gif_exif);
}

module.exports = {
  getExifMockData_jpg,
  getExifMockData_png,
  getExifMockData_gif
};
