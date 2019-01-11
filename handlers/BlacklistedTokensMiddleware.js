/**
 * Checks for blacklisted tokens
 */
class BlacklistedTokensMiddleware {
  /**
   * Checks if a token is blacklisted
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {undefined | function } [Returns nothing or next]
   */
  static checkToken(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];
    const blacklisted = global.blackListedTokens.find(blToken => blToken.token === token);

    if (blacklisted) {
      const err = {
        status: 401,
        message: 'Unauthorized'
      };
      return next(err);
    }
    next();
  }
}

module.exports = BlacklistedTokensMiddleware;
