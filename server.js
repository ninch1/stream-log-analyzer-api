const express = require('express');
const upload = require('./controllers/upload');
const errorMiddleware = require('./middleware/error');
const ErrorResponse = require('./utils/ErrorResponse');

const app = express();
const PORT = 3000;

app.post('/upload', upload);

app.use((req, res, next) => {
  next(new ErrorResponse(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
