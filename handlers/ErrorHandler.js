/**
 * Handles application errors
 */
class ErrorHandler {
  /**
   * Handles 404 errors
   *
   * @param {object} req
   * @param {object} res
   * @param {funcion} next
   * @returns {undefined} [Returns undefined]
   */
  static notFound(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }

  /**
   * Handles all errors
   *
   * @param {object} err
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {undefined} [Returns undefined]
   */
  static handler(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
    next();
  }
}

module.exports = ErrorHandler;
