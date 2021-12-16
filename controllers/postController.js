const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({ ...req.body, author: req.user });

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});
