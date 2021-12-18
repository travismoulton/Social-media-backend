const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A group must have a name'],
      unique: true,
    },
    // members -> TBD
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

// This may not be necesarry. Does it make more sense to query the
// user model for memberships with this groupId?
groupSchema.virtual('members', {
  ref: 'User',
  foreignField: 'groupMemberships',
  localField: '_id',
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
