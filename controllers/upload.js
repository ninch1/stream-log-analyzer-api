const busboy = require('busboy');
const split2 = require('split2');
const through2 = require('through2');
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

    // busboy stream
    file.on('error', (err) => {
      hasError = true;
      return next(new ErrorResponse('File error', 500));
    });

    const analyzer = file // pipes for counting logs
      .pipe(split2())
      .pipe(through2(sortLogsWrapper(summary, level, allowedLevels)));

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
