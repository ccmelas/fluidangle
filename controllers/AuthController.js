const jwt = require('jsonwebtoken');
const { User, BlacklistedToken } = require('../database/models');
/**
 * Handles authentication related functionality
 */
class AuthController {
  /**
   *Registers a new user
   * @param {object} req
   * @param {object} res
   * @returns {undefined} [Returns undefined]
   */
  static async register(req, res) {
    const user = await User.create(req.body);
    res.json({ message: 'Registration successful', user: user.publicVersion() });
  }

  /**
   * Logs in a new user
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {undefined | function } [Returns nothing or next]
   */
  static async login(req, res, next) {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      return next({ status: 401, message: 'Unauthorized' });
    }

    await user.comparePassword(req.body.password);

    res.json({ token: user.generateJWT(), user: user.publicVersion() });
  }

  /**
   * Gets an authenticated user
   * @param {object} req
   * @param {object} res
   * @returns {object} [Returns response object]
   */
  static async authUser(req, res) {
    return res.json({ user: req.user.publicVersion() });
  }

  /**
   * Logs out a user
   * @param {object} req
   * @param {object} res
   * @returns {undefined | function } [Returns nothing or next]
   */
  static async logout(req, res) {
    const token = req.header('Authorization').split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // put this payload in db blacklist
    const blToken = await BlacklistedToken.create({
      token,
      expiry: payload.exp
    });

    global.blackListedTokens.push(blToken);

    res.json({ message: 'User logged out successfully ' });
  }
}

module.exports = AuthController;
