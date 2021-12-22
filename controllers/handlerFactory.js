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

    console.log(doc);

    res.status(200).json({
      status: 'success',
      data: { [modelName]: doc },
    });
  });

exports.updateOne = (Model, modelName, fields) =>
  catchAsync(async (req, res, next) => {
    function extractUpdateFields() {
      const fieldsToUpdate = { ...req.body };

      Object.keys(fieldsToUpdate).forEach((key) => {
        if (!fields.includes(key)) delete fieldsToUpdate[key];
      });

      return fieldsToUpdate;
    }

    const updateObj = fields ? extractUpdateFields() : { ...req.body };

    const doc = await Model.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(
        new AppError(
          `No ${modelName} with that Id, please try again with a different id`,
          404
        )
      );

    res.status(200).json({
      status: 'success',
      data: { [modelName]: doc },
    });
  });
