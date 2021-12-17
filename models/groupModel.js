const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A group must have a name'],
      unique: true,
    },
    // members -> TBD
    // Threads -> TBD
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    avatar: {
      type: String,
      default: 'defaultAvatar.jpg',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

groupSchema.virtual('threads', {
  ref: 'Thread',
  foreignField: 'group',
  localField: '_id',
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
