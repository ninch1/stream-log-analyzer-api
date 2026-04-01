const express = require('express');
const busboy = require('busboy');
const split2 = require('split2');
const through2 = require('through2');

const app = express();
const PORT = 3000;

// function for through2 for counting logs
function sortLogsWrapper(response) {
  return function sortLogs(chunk, enc, callback) {
    const textType = chunk.toString().split(' ')[0];
    if (response.summary[textType]) response.summary[textType]++;
    else response.summary[textType] = 1;
    callback();
  };
}

app.post('/upload', (req, res) => {
  console.log('POST /upload hit');

  let response = { success: true, summary: {} };

  let bb; // initializing busboy
  try {
    bb = busboy({ headers: req.headers });
  } catch (error) {
    console.log('Error message: ' + error.message);
    response.success = false;
    response.error = error.message;
    return res.json(response);
  }

  bb.on('file', (name, file, info) => {
    // busboy stream
    file.on('error', (error) => {
      console.log('Error message: ' + error.message);
      response.success = false;
      response.error = error.message;
    });

    const analyzer = file
      .pipe(split2())
      .pipe(through2(sortLogsWrapper(response)));
    analyzer.on('error', (error) => {
      console.log('Error message: ' + error.message);
      response.success = false;
      response.error = error.message;
    });
  });

  bb.on('error', (error) => {
    response.success = false;
    response.error = error.message;
  });
  bb.on('finish', () => {
    res.json(response);
  });

  req.pipe(bb); // pipe request into busboy
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
