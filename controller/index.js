const Model = require('../model/index.js');

//GET
exports.getAllBlocking = (req, res) => {
  Model.getAllBlocking((getAllBlocking) => {
    res.send(getAllBlocking);
  });
};

//POST
exports.postBlocking = (req, res) => {
  Model.postBlocking(req.body, (result) => {
    res.send(result);
  });
};

exports.postFile = (req, res) => {
  try {
    // 에러가 없다면 업로드 성공 메시지 출력
    console.log(`File uploaded: ${req.file.originalname}`);
    res.send('File uploaded successfully.');
  } catch (error) {
    // 에러가 발생했을 경우 에러 메시지 출력
    console.error('Error during file upload:', error.message);
    res.send(error.message);
  }
};

exports.deleteBlocking = (req, res) => {
  Model.deleteBlocking(req.body, (result) => {
    res.send(result);
  });
};
