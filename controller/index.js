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
