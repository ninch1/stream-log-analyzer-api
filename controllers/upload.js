const busboy = require('busboy');
const split2 = require('split2');
const through2 = require('through2');
const zlib = require('zlib');
const sortLogsWrapper = require('../utils/sortLogs');
const ErrorResponse = require('../utils/ErrorResponse');

module.exports = (req, res, next) => {
  console.log('POST /upload hit');

  let hasError = false;
  let hasFile = false;

  const allowedLevels = ['ERROR', 'INFO', 'WARN'];

  // level filtering
  let { level } = req.query;
  level = level ? level.split(',').map((el) => el.trim().toUpperCase()) : [];
  let wrongLevel = false;
  level.forEach((element) => {
    if (!allowedLevels.includes(element)) wrongLevel = true;
  });
  if (wrongLevel)
    return next(
      new ErrorResponse(
        "Please send correct level type: 'ERROR', 'INFO', 'WARN'.",
        400,
      ),
    );

  let summary = {};

  let bb; // initializing busboy
  try {
    bb = busboy({ headers: req.headers });
  } catch (err) {
    hasError = true;
    return next(err);
  }

  bb.on('file', (name, file, info) => {
    hasFile = true;

    const filename = info.filename.split('.');
    const isGzip = filename[filename.length - 1].toUpperCase() === 'GZ';

    // busboy stream
    file.on('error', (err) => {
      hasError = true;
      return next(new ErrorResponse('File error', 500));
    });

    let mainStream = file;
    if (isGzip) {
      const gunzip = zlib.createGunzip();

      gunzip.on('error', (err) => {
        hasError = true;
        return next(new ErrorResponse('Unzipping error', 500));
      });

      mainStream = file.pipe(gunzip);
    }

    const analyzer = mainStream // pipes for counting logs
      .pipe(split2())
      .pipe(through2(sortLogsWrapper(summary, level, allowedLevels)));

    analyzer.on('error', (err) => {
      hasError = true;
      return next(new ErrorResponse('File error', 500));
    });

    analyzer.on('finish', () => {
      // sends response after counting whole file
      if (!hasError)
        res.json({
          success: true,
          summary,
        });
    });
  });

  bb.on('error', (err) => {
    hasError = true;
    return next(new ErrorResponse('File error', 500));
  });

  bb.on('end', () => {
    if (!hasFile) {
      return next(new ErrorResponse('No file uploaded', 400));
    }
  });

  req.pipe(bb); // pipe request into busboy
};
