const db = require('./models/');

/**
 * Handles connection to the database
 */
class DB {
  /**
  * Connection method
  * @returns {DB} [Returns instance of class]
  */
  async connect() {
    await db.sequelize.sync();
    console.log('Connected');
    return this;
  }
}

module.exports = DB;
