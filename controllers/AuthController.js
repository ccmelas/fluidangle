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
    res.json({ message: 'Registration successful', user });
  }
}

module.exports = AuthController;
