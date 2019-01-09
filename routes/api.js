const express = require('express');
const AuthController = require('../controllers/AuthController');
const ErrorHandler = require('../handlers/ErrorHandler');

const router = express.Router();

router.post('/register', ErrorHandler.catchErrors(AuthController.register));

module.exports = router;
