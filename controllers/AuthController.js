const { User } = require('../database/models');
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
   * @returns {undefined} [Returns nothing]
   */
  static async login(req, res) {
    const user = await User.findOne({ username: req.body.username });

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
}

module.exports = AuthController;
