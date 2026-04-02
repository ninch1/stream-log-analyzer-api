const busboy = require('busboy');
const split2 = require('split2');
const through2 = require('through2');
const sortLogsWrapper = require('../helpers/sortLogs');

module.exports = (req, res, next) => {
  console.log('POST /upload hit');

  let summary = {};

  let bb; // initializing busboy
  try {
    bb = busboy({ headers: req.headers });
  } catch (err) {
    return next(err);
  }

  bb.on('file', (name, file, info) => {
    // busboy stream
    file.on('error', (err) => {
      next(err);
    });

    const analyzer = file // pipes for counting logs
      .pipe(split2())
      .pipe(through2(sortLogsWrapper(summary)));
    analyzer.on('error', (err) => {
      next(err);
    });
  });

  bb.on('error', (err) => {
    next(err);
  });
  bb.on('finish', () => {
    // sends response after counting whole file
    res.json({
      success: true,
      summary,
    });
  });

  req.pipe(bb); // pipe request into busboy
};
