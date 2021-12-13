const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// INIT the app
const app = express();

// Development logging
if (process.send.NODE_ENV === 'development') app.use(morgan('dev'));

// Set security http headers
app.use(helmet());

// Data sanitiziation against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

module.exports = app;
