// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

// exports.getUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) return next(new AppError('No user exists with that id', 401));

//   res.status(201).json({
//     status: 'success',
//     data: { user },
//   });
// });

exports.getUser = factory.getOne(User, { path: 'posts createdThreads' });
