const express = require('express');

const router = express.Router();

const resetpasswordController = require('../controllers/resetpassword');

router.use('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;