const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({ ...req.body, author: req.user });

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});

exports.getPost = factory.getOne(Post, 'post', { path: 'replies' });
