const Group = require('../models/groupModel');
const User = require('../models/userModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// exports.createGroup = factory.createOne(Group, 'Group');

exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await Group.create(req.body);

  // Create a membership for the foudning user
  const user = await User.findById(req.user);
  user.addGroupMembership(group._id);

  res.status(201).json({
    status: 'sucess',
    data: { group },
  });
});
