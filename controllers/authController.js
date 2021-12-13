const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // remove password from output
  user.password = null;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({ name, email, password });

  createAndSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1: Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide an email and password', 400));

  // 2: Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  const passwordIsCorrect =
    user && (await user.correctPassword(password, user.password));

  if (!user || !passwordIsCorrect)
    return next(new AppError('Incorrect email or password', 401));

  // 3: If everything is ok send the token to the client
  createAndSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1: Get token and check if it's there

  const isBearerToken =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');

  const tokenIsInCookie = !!req.cookies.jwt;

  // eslint-disable-next-line no-nested-ternary
  const token = isBearerToken
    ? req.headers.authorization.split(' ')[1]
    : tokenIsInCookie
    ? req.cookies.jwt
    : null;

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  // decoded.iat is the timestamp that the token was issued at iat = issued at
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});