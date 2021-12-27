const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const hpp = require('hpp');

const userRouter = require('./routes/userRoutes');
const groupRouter = require('./routes/groupRoutes');
const membershipRouter = require('./routes/membershipRoute');
const threadRouter = require('./routes/threadRoutes');
const postRouter = require('./routes/postRoutes');

// INIT the app
const app = express();

// cors
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })
);

app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Set security http headers
app.use(helmet());

// Data sanitiziation against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// This line allows us to receive json in the request body
// **IMPORTANT** //
app.use(express.json());

app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/membership', membershipRouter);
app.use('/threads', threadRouter);
app.use('/posts', postRouter);

module.exports = app;
