const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const model = require('../model/index.js');
const controller = require('../controller');
const router = express.Router();

// ~~~~~~~~~~~~~~ multer 세부설정 ~~~~~~~~~~~~
// multer 관련 설정
// multer 설정

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// 파일 확장자 필터

const fileFilter = async (req, file, cb) => {
  try {
    // 데이터베이스에서 확장자 가져오기
    const disallowedFileTypes = await new Promise((resolve, reject) => {
      model.getAllBlocking((result) => {
        resolve(result);
      });
    });
    const disallowedExtensions = disallowedFileTypes.map((row) =>
      row.extension.toLowerCase()
    );
    // 사용자가 업로드한 파일의 확장자
    const userFileExtension = path.extname(file.originalname);

    if (
      disallowedExtensions.includes(userFileExtension.slice(1).toLowerCase())
    ) {
      cb(new Error('Invalid file type'));
    } else {
      cb(null, true);
    }
  } catch (error) {
    console.error(
      'Error fetching disallowed file types from the database:',
      error
    );
    cb(new Error('Internal Server Error'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: fileFilter,
});

router.get('/blocking', controller.getAllBlocking);
router.post('/blocking', controller.postBlocking);
router.post('/file', upload.single('attachment'), controller.postFile);
router.delete('/blocking', controller.deleteBlocking);
module.exports = router;
