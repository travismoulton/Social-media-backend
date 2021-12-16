const Group = require('../models/groupModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await Group.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { group },
  });
});
