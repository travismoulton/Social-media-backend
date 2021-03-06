const Post = require('../models/postModel');
const Thread = require('../models/threadModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const options = { new: true, runValidators: true };

async function updateReplyChainScore(post, incrementVal) {
  const ancestorsToUpdate = await Promise.all(
    post.ancestors.map((ancestorId) => Post.findById(ancestorId))
  );

  const ancestorsToSave = ancestorsToUpdate.map((ancestor) => {
    ancestor.replyChainScore += incrementVal;
    return ancestor.save();
  });

  await Promise.all(ancestorsToSave);
}

async function updateThreadScore(post, incrementVal) {
  const thread = await Thread.findById(post.thread);
  thread.likeScore += incrementVal;
  await thread.save();
}

//
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
      $inc: {
        likeCount: 1,
        dislikeCount: -1,
        likeScore: 2,
        replyChainScore: 1,
      },
      $push: { usersLiked: userId },
      $pull: { usersDisliked: userId },
    },
    { ...options }
  );

  const neutralPost = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersLiked: { $ne: userId },
    },
    {
      $inc: { likeCount: 1, likeScore: 1, replyChainScore: 1 },
      $push: { usersLiked: userId },
    },
    { ...options }
  );

  if (!neutralPost && !dislikedPost)
    return next(new AppError('This user has already liked this post', 400));

  // Update the all of the post's ancestors to increase their reply chain score
  const post = neutralPost || dislikedPost;
  // If the post was neutral, it should go up by 1, but if it was disliked it should go
  // up by 2
  const incrementVal = neutralPost ? 1 : 2;
  await updateReplyChainScore(post, incrementVal);
  await updateThreadScore(post, incrementVal);

  const data = neutralPost ? { post: neutralPost } : { post: dislikedPost };
  res.status(200).json({ status: 'Success', data });
});

//
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
      $inc: {
        likeCount: -1,
        dislikeCount: 1,
        likeScore: -2,
        replyChainScore: -1,
      },
      $pull: { usersLiked: userId },
      $push: { usersDisliked: userId },
    },
    { ...options }
  );

  const neutralPost = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersDisliked: { $ne: userId },
    },
    {
      $inc: { dislikeCount: 1, likeScore: -1, replyChainScore: -1 },
      $push: { usersDisliked: userId },
    },
    { ...options }
  );

  if (!neutralPost && !likedPost)
    return next(new AppError('This user has already disliked this post', 400));

  // Update the all of the post's ancestors to increase their reply chain score
  const post = neutralPost || likedPost;
  // If the post was neutral, it should go up by 1, but if it was disliked it should go
  // up by 2
  const incrementVal = neutralPost ? -1 : -2;
  await updateReplyChainScore(post, incrementVal);
  await updateThreadScore(post, incrementVal);

  const data = neutralPost ? { post: neutralPost } : { post: likedPost };
  res.status(200).json({ status: 'success', data });
});

//
exports.removeLike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  if (!(await Post.findById(postId)))
    return next(new AppError('No post with that Id exists', 404));

  const post = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersLiked: { $eq: userId },
    },
    {
      $inc: { likeCount: -1, likeScore: -1, replyChainScore: -1 },
      $pull: { usersLiked: userId },
    },
    { ...options }
  );

  if (!post)
    return next(
      new AppError('This user does not currently like this post', 400)
    );

  // Update the all of the post's ancestors to increase their reply chain score
  await updateReplyChainScore(post, -1);
  await updateThreadScore(post, -1);

  res.status(200).json({ status: 'success', data: { post } });
});

//
exports.removeDislike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  if (!(await Post.findById(postId)))
    return next(new AppError('No post with that Id exists', 404));

  const post = await Post.findOneAndUpdate(
    {
      _id: postId,
      usersDisliked: { $eq: userId },
    },
    {
      $inc: { dislikeCount: -1, likeScore: 1, replyChainScore: 1 },
      $pull: { usersDisliked: userId },
    },
    { ...options }
  );

  if (!post)
    return next(
      new AppError('This user does not currently dislike this post', 400)
    );

  // Update the all of the post's ancestors to increase their reply chain score
  await updateReplyChainScore(post, 1);
  await updateThreadScore(post, 1);

  res.status(200).json({ status: 'success', data: { post } });
});
