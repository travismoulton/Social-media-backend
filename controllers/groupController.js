const Group = require('../models/groupModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createGroup = factory.createOne(Group, 'Group');
