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
      error: err.errors || err
    });
    next();
  }

  /**
   * Wrapper for catching async/await errors
   * @param {function} fn
   * @returns {function} [Composed function with error handler attached]
   */
  static catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
  }
}

module.exports = ErrorHandler;
