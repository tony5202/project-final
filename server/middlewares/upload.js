const multer = require('multer');
const path = require('path');

// กำหนด storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'product_image/'); // โฟลเดอร์ที่ใช้เก็บรูป
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // เปลี่ยนชื่อไฟล์
  }
});

// ตรวจสอบประเภทไฟล์
const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
