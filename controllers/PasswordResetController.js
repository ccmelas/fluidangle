const crypto = require('crypto');
const Sequelize = require('sequelize');
const { User } = require('./../database/models/');
const MailHandler = require('./../handlers/MailHandler');

/** Handles password resets */
class PasswordResetController {
  /**
   * Sends password reset links to valid password forgot requests
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async forgot(req, res) {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (user) {
      // Update token field
      user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hr from now

      await user.save();

      const resetURL = `http://${req.headers.host}/api/v1/password-reset/${user.resetPasswordToken}`;

      // res.json({ resetURL });
      // send mail
      await MailHandler.send({
        user,
        subject: 'Password Reset',
        resetURL,
        fileName: 'password-reset'
      });
    }

    res.json({ message: 'You have been sent a password reset link' });
  }

  /**
   * Checks if password fields match
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { undefined } [Returns nothing]
   */
  static confirmedPasswords(req, res, next) {
    if (req.body.password === req.body['password-confirm']) {
      return next();
    }

    next({
      status: 422,
      message: 'Passwords do not match'
    });
  }

  /**
   * Reset passwords
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async reset(req, res) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token expired or user not found' });
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.password = req.body.password;
    const updatedUser = await user.save();
    res.json({ message: 'Password reset successfully', user: updatedUser.publicVersion() });
  }

  /**
   * Gets password rest form
   * @param {object} req
   * @param {object} res
   * @returns { undefined } [Returns nothing]
   */
  static async getResetForm(req, res) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token expired or user not found' });
    }

    res.render('reset-password', { token: req.params.token });
  }
}

module.exports = PasswordResetController;
