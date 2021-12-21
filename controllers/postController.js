const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({ ...req.body, author: req.user });

  if (!post.isInitialPost) {
    const parentId = post.parentPost.toString();

    const parentPost = await Post.findById(parentId);

    post.ancestors = [parentPost.id, ...parentPost.ancestors];

    await post.save();
  }

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});

exports.getPost = factory.getOne(Post, 'post');
