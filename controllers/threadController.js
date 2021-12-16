const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const Thread = require('../models/threadModel');

exports.createThread = catchAsync(async (req, res, next) => {
  const thread = await Thread.create({ ...req.body, author: req.user._id });

  res.status(201).json({
    status: 'sucess',
    data: { thread },
  });
});
