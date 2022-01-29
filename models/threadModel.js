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
    likeScore: {
      type: Number,
      default: 0,
      min: -Infinity,
      max: Infinity,
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

threadSchema.virtual('numComments', {
  ref: 'Post',
  foreignField: 'thread',
  localField: '_id',
  count: true,
});

// Not sure whether to put this in. It will query the entire reply chain every time, which
// isn't ideal.
// threadSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'initialPost' });
//   next();
// });

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;
