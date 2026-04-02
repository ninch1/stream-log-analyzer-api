const express = require('express');
const upload = require('./controllers/upload');
const errorMiddleware = require('./middleware/error');

const app = express();
const PORT = 3000;

app.post('/upload', upload);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
