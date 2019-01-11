const dotenv = require('dotenv');

// load environment variables
dotenv.config({ path: '.env' });


const Sequelize = require('sequelize');
const DB = require('./database/DB');
const app = require('./app');
const { BlacklistedToken } = require('./database/models');


// Set port for the server
app.set('port', process.env.PORT || 3000);

global.blackListedTokens = [];

// Connect to the database
new DB().connect().then(async () => {
  // delete expired blacklisted tokens
  await BlacklistedToken.destroy(
    { where: { expiry: { [Sequelize.Op.lt]: parseInt(Date.now() / 100, 10) } } }
  );
  // fetch blacklisted tokens
  global.blackListedTokens = await BlacklistedToken.findAll();
  // Start the server on successful DB connection
  app.listen(app.get('port'));
});


module.exports = app;
