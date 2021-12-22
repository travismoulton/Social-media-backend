const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A thread must have a title'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    group: {
      type: mongoose.Schema.ObjectId,
      ref: 'Group',
    },
    initialPost: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    // Post count -> Siome sort of aggregation
    // Like / Dislike score -> some sort of aggergation
    // Contributors -> Not sure if needed yet.
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

threadSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'thread',
  localField: '_id',
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;
