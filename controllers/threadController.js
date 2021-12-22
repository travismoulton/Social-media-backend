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

// exports.getThread = factory.getOne(Thread, 'thread', {
//   path: 'posts',
//   // Deep populate the replies from each post
//   populate: { path: 'replies' },
// });

exports.getThread = catchAsync(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id).populate({
    path: 'posts',
    populate: { path: 'replies' },
  });

  const initialPost = thread.posts[0];

  const returnThread = [initialPost];

  let currentReplyLevel = 1;

  initialPost.replies.forEach((reply) => {
    console.log(reply);
    if (reply.replyLevel === currentReplyLevel) returnThread.push(reply);
  });

  res.status(200).json({ status: 'success', data: thread });
});

// Recursive function to extract unwanted posts

// Need to know the highest reply level beforehand?
