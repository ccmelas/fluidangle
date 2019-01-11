const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/api');
const ErrorHandler = require('./handlers/ErrorHandler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register api routes
app.use('/api', apiRoutes);

// Registers handler for when routes are not found
app.use(ErrorHandler.notFound);

// Registers handler for all errors
app.use(ErrorHandler.handler);

module.exports = app;
