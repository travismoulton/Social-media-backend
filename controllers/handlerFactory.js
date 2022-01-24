const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { modelName } = Model.collection;
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { [modelName]: doc },
    });
  });

exports.getOne = (Model, popOptions, queryOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { modelName } = Model.collection;

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
      data: { [modelName.toLowerCase()]: doc },
    });
  });

exports.updateOne = (Model, fields) =>
  catchAsync(async (req, res, next) => {
    // Extract modelName
    const { modelName } = Model.collection;

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
      return { excludedFields, fieldsToUpdate };
    }

    const { fieldsToUpdate, excludedFields } = extractUpdateFields();

    // Create a message to tell the api user that certain fields can't be updated
    // by this route only if there were fields excluded from the request
    const excludedFieldsMessage =
      excludedFields.length > 0 &&
      `The following fields could not be updated by this route: ${excludedFields.join(
        ', '
      )}`;

    const doc = await Model.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
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
      data: { [modelName.toLowerCase()]: doc },
    });
  });
