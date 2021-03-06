// const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide an email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: Date,
    groupMemberships: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Group',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'author',
  localField: '_id',
});

userSchema.virtual('createdThreads', {
  ref: 'Thread',
  foreignField: 'author',
  localField: '_id',
});

// Hash password upon user creation and password update
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  // Only run the function when a user updates their password,
  // Not when a new user is created
  if (!this.isModified('password') || this.isNew) return next();

  // The database save is slower than creating the web token, so we adjust
  // passwordChangeAt by 1 second so that the date is before the json
  // web token is created
  this.passwordChangedAt = Date.now() - 1000;
});

// Method to check that the given password matches is correct
userSchema.methods.correctPassword = async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
};

// Method to check if a user password has been changed a JWT was created
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.addGroupMembership = async function (groupId) {
  this.groupMemberships.push(groupId);
  await this.save();
};

userSchema.methods.removeGroupMembership = async function (groupId) {
  const groupIndex = this.groupMemberships.indexOf(groupId);

  // Chreate a new array without the groupId we are removing
  const newMembershipArr = this.groupMemberships
    .splice(0, groupIndex)
    .concat(this.groupMemberships.splice(groupIndex + 1));

  this.groupMemberships = newMembershipArr;
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
