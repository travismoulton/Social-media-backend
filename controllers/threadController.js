const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const Thread = require('../models/threadModel');
const factory = require('./handlerFactory');

exports.createThread = catchAsync(async (req, res, next) => {
  const thread = await Thread.create({ ...req.body, author: req.user });

  res.status(201).json({
    status: 'sucess',
    data: { thread },
  });
});

exports.getThread = factory.getOne(Thread, 'thread', {
  path: 'posts',
  // Deep populate the replies from each post
  populate: { path: 'replies' },
});
