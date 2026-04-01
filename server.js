const express = require('express');
const busboy = require('busboy');
const split2 = require('split2');
const through2 = require('through2');

const app = express();
const PORT = 3000;

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

  const bb = busboy({ headers: req.headers });
  bb.on('file', (name, file, info) => {
    file.pipe(split2()).pipe(through2(sortLogsWrapper(response)));
    file.on('error', (err) => {
      console.log(err);
      response.success = false;
    });
  });

  req.pipe(bb); // pipe request into busboy
  bb.on('error', (err) => {
    response.success = false;
  });
  bb.on('finish', () => {
    if (response.success) {
      res.json(response);
    } else {
      console.log(err);
      response.error = 'An unexpected error';
      res.json(response);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
