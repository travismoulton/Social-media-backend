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

exports.getOne = (Model, modelName, popOptions, queryOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // If populate options are passed in, add them to the query, otherwise do not
    const query = popOptions
      ? Model.findById(id, null, { ...queryOptions }).populate(popOptions)
      : Model.findById(id, null, { ...queryOptions });

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

exports.updateOne = (Model, modelName, fields) =>
  catchAsync(async (req, res, next) => {
    function extractUpdateFields() {
      const fieldsToUpdate = { ...req.body };
      const excludedFields = [];

      Object.keys(fieldsToUpdate).forEach((key) => {
        // Remove any field passed by the request that is not included in the list
        // passed by the getter function
        if (!fields.includes(key)) {
          delete fieldsToUpdate[key];
          excludedFields.push(key);
        }
      });

      // Only return excluded fields if there are any fields in the array
      return excludedFields.length
        ? { excludedFields, fieldsToUpdate }
        : { fieldsToUpdate };
    }

    // Only run the extract fields function if an array of accepted fields is passed in
    const { fieldsToUpdate, excludedFields } = fields && extractUpdateFields();

    // Create a message to tell the api user that certain fields can't be updated
    // by this route
    const excludedFieldsMessage =
      excludedFields &&
      `The following fields could not be updated by this route: ${excludedFields.join(
        ', '
      )}`;

    const updateObj = fieldsToUpdate || { ...req.body };

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
      excludedFieldsMessage,
      data: { [modelName]: doc },
    });
  });
