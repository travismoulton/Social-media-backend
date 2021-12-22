const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'A post can not be empty'],
    },
    thread: {
      type: mongoose.Schema.ObjectId,
      ref: 'Thread',
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usersLiked: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    dislikeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usersDisliked: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    likeScore: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    replies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
    ],
    ancestors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
    ],
    parentPost: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    hasBeenEdited: {
      type: Boolean,
      default: false,
    },
    lastEditedAt: {
      type: Date,
    },
    // For sorting purposes when populating threads. Want this to stay at the top regardless of like score
    isInitialPost: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Will be run when a thread is fetched for display
postSchema.pre(/^find/, function (next) {
  const { skipMiddleware } = this.getOptions();
  if (skipMiddleware) return next();

  this.populate('replies');
  next();
});

postSchema.methods.removeReplies = function () {
  this.replies = [];
  return this;
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
