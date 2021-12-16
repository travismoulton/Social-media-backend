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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
