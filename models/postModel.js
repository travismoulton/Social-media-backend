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
    replyChainScore: {
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
  const { shouldFetchReplies } = this.getOptions();
  if (!shouldFetchReplies) return next();

  this.populate({
    path: 'replies',
    options: { shouldFetchReplies: true, sort: [{ replyChainScore: 'desc' }] },
  });
  next();
});

// Run when post content has been edited
postSchema.pre('save', async function (next) {
  if (!this.isNew && this.isModified('content')) {
    this.hasBeenEdited = true;
    this.lastEditedAt = Date.now();
  }

  return next();
});

postSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author' });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
