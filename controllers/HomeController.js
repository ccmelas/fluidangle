/**
 * Manages the homepage
 */
class HomeController {
  /**
   * Returns the index page
   * @param {object} req
   * @param {object} res
   * @returns { * } []
   */
  static index(req, res) {
    res.json({ message: 'Welcome to the fluid angle api.' });
  }
}

module.exports = HomeController;
