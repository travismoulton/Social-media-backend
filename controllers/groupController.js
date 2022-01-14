const Group = require('../models/groupModel');
const User = require('../models/userModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const sendErrorJson = require('../utils/sendErrorJson');

exports.createGroup = catchAsync(async (req, res, next) => {
  const existingGroup = await Group.find({ name: { $eq: req.body.name } });

  if (existingGroup.length)
    return sendErrorJson(res, 'A group already exists with that name', 404);

  const group = await Group.create({ ...req.body, createdBy: req.user });

  // Create a membership for the foudning user
  const foundingUser = await User.findById(req.user);
  foundingUser.addGroupMembership(group._id);

  res.status(201).json({
    status: 'success',
    data: group,
  });
});

exports.getGroup = factory.getOne(Group, { path: 'threads memberCount' });

exports.updateGroup = factory.updateOne(Group, ['avatar', 'name']);
