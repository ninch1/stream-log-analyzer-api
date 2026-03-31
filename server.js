const express = require('express');
const PORT = 3000;
const app = express();

app.post('/upload', (req, res) => {
  console.log('POST /upload hit');
  res.end('upload endpoint');
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
