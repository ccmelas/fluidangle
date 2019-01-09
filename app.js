const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const ErrorHandler = require('./handlers/ErrorHandler');

const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register api routes
app.use('/api/v1', apiRoutes);

// Registers handler for when routes are not found
app.use(ErrorHandler.notFound);

// Registers handler for all errors
app.use(ErrorHandler.handler);

module.exports = app;
