# Stream Log Analyzer API

A Node.js API that processes uploaded log files using streams and returns a summary of log levels.

---

## 🚀 Features

- Upload log files via HTTP (`multipart/form-data`)
- Processes files using **Node.js streams** (no buffering)
- Splits file into lines using `split2`
- Analyzes logs in real-time using `through2`
- Counts log levels:
  - INFO
  - WARN
  - ERROR

- Robust error handling with custom error middleware

---

## 🧠 Tech Stack

- Node.js
- Express
- Busboy (streaming file uploads)
- split2 (line-by-line stream processing)
- through2 (transform streams)

---

## 📂 Project Structure

```
.
├── controllers/
│   └── upload.js
├── middleware/
│   └── error.js
├── utils/
│   ├── sortLogs.js
│   └── ErrorResponse.js
├── server.js
```

---

## 📥 API Endpoint

### POST `/upload`

Upload a log file.

#### Request

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file` → log file

#### Example (Postman)

- Body → form-data
- Key: `file`
- Type: File
- Select your `.txt` log file

---

## 📤 Response

### Success

```json
{
  "success": true,
  "summary": {
    "INFO": 10,
    "WARN": 2,
    "ERROR": 1
  }
}
```

### Error

```json
{
  "success": false,
  "error": "Expected multipart/form-data upload"
}
```

---

## ⚙️ How It Works

The API uses a streaming pipeline:

```
req → busboy → file stream → split2 → through2 → summary
```

- `busboy` extracts the uploaded file as a stream
- `split2` converts chunks into lines
- `through2` processes each line and counts log levels
- Response is sent after the stream finishes

---

## 🧪 Running Locally

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
node server.js
```

or (if using nodemon):

```bash
npm run dev
```

3. Send request via Postman to:

```
http://localhost:3000/upload
```

---

## ❗ Notes

- Only supports **text-based log files**
- Files are processed as streams (memory efficient)
- Large files are handled without loading entire file into memory

---

## 📌 Future Improvements

- Filter logs by level (e.g., only ERROR)
- Support compressed logs (`.gz`)
- Add validation for file type
- Improve logging and metrics

---

## 👤 Author

Elguja Modebadze
