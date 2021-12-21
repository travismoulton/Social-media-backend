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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // isReply: {
    //   type: Boolean,
    //   default: false,
    // },
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

// postSchema.pre('save', async function (next) {
//   if (!this.isNew) return next();

//   // How do I run this query
//   const parentId = this.parentPost;

//   const parentPost = Post.findById(parentId);

//   this.ancestors = [this.parentPost, ...parentPost.ancestors];

//   return next();
// });

// postSchema.virtual('replies', {
//   ref: 'Post',
//   foreignField: 'parentPost',
//   localField: '_id',
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
