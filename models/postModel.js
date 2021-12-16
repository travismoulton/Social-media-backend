const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'A post can not be empty'],
    },
    // Is this correct? Going for parent reference
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    // Need something to capture what post it is a reply to. Can a document reference it's own schema
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
