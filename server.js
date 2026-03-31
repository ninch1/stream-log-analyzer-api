const express = require('express');
const busboy = require('busboy');

const app = express();
const PORT = 3000;

app.post('/upload', (req, res) => {
  console.log('POST /upload hit');

  const bb = busboy({ headers: req.headers });
  bb.on('file', (name, file, info) => {
    file.resume();
  });

  req.pipe(bb); // pipe request into busboy

  res.end('upload endpoint');
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
