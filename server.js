const express = require('express');
const busboy = require('busboy');
const split2 = require('split2');
const through2 = require('through2');

const app = express();
const PORT = 3000;

function sortLogsWrapper(response) {
  return function sortLogs(chunk, enc, callback) {
    const textType = chunk.toString().split(' ')[0];
    if (response[textType]) response[textType]++;
    else response[textType] = 1;
    callback();
  };
}

app.post('/upload', (req, res) => {
  console.log('POST /upload hit');

  let response = {};

  const bb = busboy({ headers: req.headers });
  bb.on('file', (name, file, info) => {
    file.pipe(split2()).pipe(through2(sortLogsWrapper(response)));
  });

  req.pipe(bb); // pipe request into busboy
  bb.on('finish', () => {
    res.json(response);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
