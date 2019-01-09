const dotenv = require('dotenv');

// load environment variables
dotenv.config({ path: '.env' });


const DB = require('./database/DB');
const app = require('./app');

// Set port for the server
app.set('port', process.env.PORT || 3000);

// Connect to the database
new DB().connect().then(() => {
  // Start the server on successful DB connection
  app.listen(app.get('port'));
});
