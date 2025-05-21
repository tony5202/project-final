const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure slip_payment directory exists
const uploadDir = 'slip_payment/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Allow all file types
const upload = multer({
  storage: storage
});

module.exports = upload;