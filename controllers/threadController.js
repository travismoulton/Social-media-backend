const catchAsync = require('../utils/catchAsync');
const Thread = require('../models/threadModel');
const Post = require('../models/postModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.createThread = catchAsync(async (req, res, next) => {
  const thread = await Thread.create({ ...req.body, author: req.user });

  res.status(201).json({
    status: 'sucess',
    data: thread,
  });
});

exports.createThreadWithIntialPost = catchAsync(async (req, res, next) => {
  const thread = await Thread.create({ ...req.body, author: req.user });

  const post = await Post.create({
    ...req.body,
    thread: thread._id,
    author: req.user,
    isInitialPost: true,
  });

  await Thread.findByIdAndUpdate(thread._id, { initialPost: post._id });

  res.status(201).json({
    status: 'sucess',
    data: thread,
  });
});

// exports.getThread = factory.getOne(Thread, 'thread');

exports.editThread = factory.updateOne(Thread, ['initialPost']);

exports.getThread = catchAsync(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread)
    return next(new AppError('There is no thread with that id', 400));

  const initialPost = await Post.findById(thread.initialPost.toString(), null, {
    shouldFetchReplies: true,
  });

  res
    .status(200)
    .json({ status: 'success', data: { thread, posts: initialPost } });
});
