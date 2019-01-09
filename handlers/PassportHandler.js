const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const { User } = require('../database/models');

/**
 * Passport Handler
 */
class PassportHandler {
  /**
   * Extracts and returns JWT Options
   * @returns { object } [JWT Options Object]
   *
   */
  static getOptions() {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    };
  }

  /**
   * Passport Middleware
   * @returns { object } [Returns a middleware object]
   */
  static passportMiddleware() {
    const options = PassportHandler.getOptions();

    return passport.use(
      new Strategy(options, async (payload, done) => {
        const user = await User.findByPk(payload.user_id);
        return done(null, user || false);
      })
    );
  }

  /**
   * Main Middleware
   * @returns { object } [Returns passort middleware authentication call]
   */
  static middleware() {
    return PassportHandler.passportMiddleware().authenticate('jwt', { session: false });
  }
}

module.exports = PassportHandler;
