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
    // Will need a way to track what user liked a post. Does like and dislike needs it's own schema?
    // likes: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // dislikes: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    isReply: {
      type: Boolean,
      default: false,
    },
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

postSchema.virtual('replies', {
  ref: 'Post',
  foreignField: 'parentPost',
  localField: '_id',
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
