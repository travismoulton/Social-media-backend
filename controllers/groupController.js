const Group = require('../models/groupModel');
const User = require('../models/userModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await Group.create({ ...req.body, createdBy: req.user });

  // Create a membership for the foudning user
  const foundingUser = await User.findById(req.user);
  foundingUser.addGroupMembership(group._id);

  res.status(201).json({
    status: 'sucess',
    data: { group },
  });
});

exports.getGroup = factory.getOne(Group, 'Group', { path: 'threads' });

exports.updateGroup = factory.updateOne(Group, 'Group', ['avatar', 'name']);
