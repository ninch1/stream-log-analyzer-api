const busboy = require('busboy');
const split2 = require('split2');
const through2 = require('through2');
const sortLogsWrapper = require('../utils/sortLogs');
const ErrorResponse = require('../utils/ErrorResponse');

module.exports = (req, res, next) => {
  console.log('POST /upload hit');

  let hasError = false;
  let hasFile = false;

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

    // busboy stream
    file.on('error', (err) => {
      hasError = true;
      return next(new ErrorResponse('File error', 500));
    });

    const analyzer = file // pipes for counting logs
      .pipe(split2())
      .pipe(through2(sortLogsWrapper(summary)));
    analyzer.on('error', (err) => {
      hasError = true;
      return next(new ErrorResponse('File error', 500));
    });
  });

  bb.on('error', (err) => {
    hasError = true;
    return next(new ErrorResponse('File error', 500));
  });
  bb.on('finish', () => {
    if (!hasFile && !hasError) {
      return next(new ErrorResponse('No file uploaded', 400));
    }

    // sends response after counting whole file
    if (!hasError)
      res.json({
        success: true,
        summary,
      });
  });

  req.pipe(bb); // pipe request into busboy
};
