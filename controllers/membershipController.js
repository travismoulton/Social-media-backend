const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Group = require('../models/groupModel');

exports.createMembership = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user);

  // Confirm the group exists
  const group = await Group.findById(req.params.groupId);
  if (!group) return next(new AppError('No group with that id exists', 400));

  // If the user is already a member of that group return an error
  if (user.groupMemberships.includes(req.params.groupId))
    return next(
      new AppError('This user is already a member of this group', 400)
    );

  await user.addGroupMembership(req.params.groupId);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.removeMembership = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user);

  // check if the user is a member of that group
  if (!user.groupMemberships.includes(req.params.groupId))
    return next(new AppError('This user is not a member of this group', 400));

  await user.removeGroupMembership(req.params.groupId);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
