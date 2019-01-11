const express = require('express');
const AuthController = require('../controllers/AuthController');
const ContactController = require('../controllers/ContactController');
const PasswordResetController = require('../controllers/PasswordResetController');
const ErrorHandler = require('../handlers/ErrorHandler');
const PassportHandler = require('../handlers/PassportHandler');
const BlacklistedTokensMiddleware = require('../handlers/BlacklistedTokensMiddleware');

const router = express.Router();

router.post('/register', ErrorHandler.catchErrors(AuthController.register));
router.post('/login', ErrorHandler.catchErrors(AuthController.login));
router.get('/logout', PassportHandler.middleware(), AuthController.logout);
router.post('/password-forgot', ErrorHandler.catchErrors(PasswordResetController.forgot));
router.get('/password-reset/:token',
  PasswordResetController.getResetForm);
router.post('/password-reset/:token',
  PasswordResetController.confirmedPasswords,
  ErrorHandler.catchErrors(PasswordResetController.reset));


router.get('/me',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  AuthController.authUser);

router.post('/contacts',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.store));

router.get('/contacts',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.index));

router.get('/contacts/starred',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.starred));

router.get('/contacts/:contact_id',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.show));

router.patch('/contacts/:contact_id',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.update));

router.patch('/contacts/:contact_id/star',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.star));

router.patch('/contacts/:contact_id/unstar',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.unstar));

router.delete('/contacts/:contact_id',
  BlacklistedTokensMiddleware.checkToken,
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.delete));

module.exports = router;
