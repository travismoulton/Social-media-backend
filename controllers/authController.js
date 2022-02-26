// const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendErrorJson = require('../utils/sendErrorJson');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + ninetyDays),
    httpOnly: true,
    secure: true,
    domain: '.social-app-frontend.netlify.app',
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

  // This will return an empty array if there is no user
  const existingUser = await User.find({ email: { $eq: email } });

  // Have to check for length because find returns an empty array if no user is present
  if (existingUser.length)
    return sendErrorJson(res, 'That email is already taken', 401);

  if (password.length < 8)
    return sendErrorJson(res, 'Password must be at least 8 characters', 400);

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
    return sendErrorJson(res, 'Incorrect email or password', 401);

  // 3: If everything is ok send the token to the client
  createAndSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1: Get token and check if it's there

  const isBearerToken =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');

  const tokenIsInCookie = req.cookies && !!req.cookies.jwt;

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

  next();
});

exports.checkIfUserIsLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.cookies && req.cookies.jwt;

  const noUserResponse = () =>
    res.status(204).json({ status: 'No user found' });

  // If the page is refreshed immediatley after a user is logged out there will
  // still be a token, but it is in valid (loggedout)
  if (token && token !== 'loggedout') {
    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) noUserResponse();

    // Check if user has changed password since this token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) noUserResponse();

    // All checks passed
    res.status(200).json({ status: 'success', data: { user: currentUser } });
  } else {
    noUserResponse();
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1: Get User
  const user = await User.findById(req.user.id).select('+password');

  //2: Check if original password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(new AppError('Your current password is incorrect', 401));

  // 3: If the password is correct update the password
  user.password = req.body.password;
  await user.save();

  // Log user in with new password
  createAndSendToken(user, 200, req, res);
});
