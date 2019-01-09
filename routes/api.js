const express = require('express');
const AuthController = require('../controllers/AuthController');
const ErrorHandler = require('../handlers/ErrorHandler');
const PassportHandler = require('../handlers/PassportHandler');

const router = express.Router();

router.post('/register', ErrorHandler.catchErrors(AuthController.register));
router.post('/login', ErrorHandler.catchErrors(AuthController.login));
router.get('/me',
  PassportHandler.middleware(),
  AuthController.authUser);

module.exports = router;
