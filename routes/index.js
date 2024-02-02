const express = require('express');
const controller = require('../controller');
const router = express.Router();

router.get('/blocking', controller.getAllBlocking);
router.post('/blocking', controller.postBlocking);
router.delete('/blocking', controller.deleteBlocking);
module.exports = router;
