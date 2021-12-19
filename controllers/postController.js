const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({ ...req.body, author: req.user });

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});

exports.getPost = factory.getOne(Post, 'post', { path: 'replies' });

exports.addLike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  if (!(await Post.findById(postId)))
    return next(new AppError('No post with that Id exists', 404));

  const dislikedPost = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersLiked: { $ne: userId },
      usersDisliked: { $eq: userId },
    },
    {
      $inc: { likeCount: 1, dislikeCount: -1 },
      $push: { usersLiked: userId },
      $pull: { usersDisliked: userId },
    }
  );

  const neutralPost = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersLiked: { $ne: userId },
    },
    {
      $inc: { likeCount: 1 },
      $push: { usersLiked: userId },
    }
  );

  if (!neutralPost && !dislikedPost)
    return next(new AppError('This user has already liked this post', 400));

  const data = neutralPost ? { neutralPost } : { dislikedPost };

  res.status(200).json({ status: 'Success', data });
});

exports.addDislike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  if (!(await Post.findById(postId)))
    return next(new AppError('No post with that Id exists', 404));

  const likedPost = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersLiked: { $eq: userId },
      usersDisliked: { $ne: userId },
    },
    {
      $inc: { likeCount: -1, dislikeCount: 1 },
      $pull: { usersLiked: userId },
      $push: { usersDisliked: userId },
    }
  );

  const neutralPost = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersDisliked: { $ne: userId },
    },
    {
      $inc: { likeCount: 1 },
      $push: { usersDisliked: userId },
    }
  );

  if (!neutralPost && !likedPost)
    return next(new AppError('This user has already disliked this post', 404));

  const data = neutralPost ? { neutralPost } : { likedPost };

  res.status(200).json({ status: 'success', data });
});
