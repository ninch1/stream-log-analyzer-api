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

- 🔍 Filter logs via query parameters:
  - `?level=ERROR`
  - `?level=ERROR,WARN`

- 📦 Supports **gzip compressed logs (`.gz`)**
- 📊 Returns processing metrics:
  - total lines processed
  - matched lines (after filtering)

- Robust error handling with custom error middleware

---

## 🧠 Tech Stack

- Node.js
- Express
- Busboy (streaming file uploads)
- split2 (line-by-line stream processing)
- through2 (transform streams)
- zlib (gzip decompression)

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

Upload a log file and optionally filter by log level.

---

### 🔹 Query Parameters

| Param   | Description                          |
| ------- | ------------------------------------ |
| `level` | Filter logs (comma-separated values) |

#### Examples

```
/upload
/upload?level=ERROR
/upload?level=ERROR,WARN
```

---

### 🔹 Request

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file` → log file (`.txt` or `.gz`)

#### Example (Postman)

- Body → form-data
- Key: `file`
- Type: File
- Select your `.txt` or `.gz` log file

---

## 📤 Response

### Success

```json
{
  "success": true,
  "summary": {
    "INFO": 2,
    "WARN": 1,
    "ERROR": 1
  },
  "metrics": {
    "totalLines": 5,
    "matchedLines": 4
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
req → busboy → file → (optional gunzip) → split2 → through2 → summary
```

- `busboy` extracts the uploaded file as a stream
- `zlib` decompresses `.gz` files when needed
- `split2` converts chunks into lines
- `through2` processes each line and counts log levels
- Filtering and metrics are applied during streaming
- Response is sent after processing completes

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

- Supports both **plain text and gzip-compressed logs**
- Files are processed as streams (memory efficient)
- Large files are handled without loading entire file into memory
- Unknown log levels are ignored
- Filtering applies only to predefined levels (`INFO`, `WARN`, `ERROR`)

---

## 📌 Future Improvements

- Advanced filtering (by message content)
- Multiple file uploads
- File size limits & validation
- Performance optimizations (stream pipeline abstraction)

---

## 👤 Author

Elguja Modebadze
