const express = require('express');
const AuthController = require('../controllers/AuthController');
const ContactController = require('../controllers/ContactController');
const ErrorHandler = require('../handlers/ErrorHandler');
const PassportHandler = require('../handlers/PassportHandler');

const router = express.Router();

router.post('/register', ErrorHandler.catchErrors(AuthController.register));
router.post('/login', ErrorHandler.catchErrors(AuthController.login));
router.get('/me',
  PassportHandler.middleware(),
  AuthController.authUser);

router.post('/contacts',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.store));

router.get('/contacts',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.index));

router.get('/contacts/starred',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.starred));

router.get('/contacts/:contact_id',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.show));

router.patch('/contacts/:contact_id',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.update));

router.patch('/contacts/:contact_id/star',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.star));

router.patch('/contacts/:contact_id/unstar',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.unstar));

router.delete('/contacts/:contact_id',
  PassportHandler.middleware(),
  ErrorHandler.catchErrors(ContactController.delete));

module.exports = router;
