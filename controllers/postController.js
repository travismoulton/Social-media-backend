const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({ ...req.body, author: req.user });

  if (post.parentPost) {
    // Get the parent post
    const parentId = post.parentPost.toString();
    const parentPost = await Post.findById(parentId);

    // Add the current post to the replies of the parent
    parentPost.replies.push(post._id);

    // Add the parent post, and all of it's ancestors to the current posts
    // ancestors field
    post.ancestors = [parentId, ...parentPost.ancestors];

    await parentPost.save();
    await post.save();
  }

  res.status(201).json({
    status: 'success',
    data: post,
  });
});

exports.getPost = factory.getOne(Post, {
  path: 'replies',
  options: { shouldFetchReplies: true, sort: [{ replyChainScore: 'desc' }] },
});
exports.editPostContent = factory.updateOne(Post, ['content']);
