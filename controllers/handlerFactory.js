const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOne = (Model, modelName) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { [modelName]: doc },
    });
  });

exports.getOne = (Model, modelName, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = popOptions
      ? Model.findById(req.params.id).populate(popOptions)
      : Model.findById(req.params.id);

    const doc = await query;

    if (!doc)
      return next(
        new AppError(`No ${modelName} could be found with that id`, 404)
      );

    res.status(200).json({
      status: 'success',
      data: { [modelName]: doc },
    });
  });
