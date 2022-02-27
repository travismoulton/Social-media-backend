const catchAsync = require('../utils/catchAsync');
const Thread = require('../models/threadModel');
const Post = require('../models/postModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const sendErrorJson = require('../utils/sendErrorJson');

exports.createThread = catchAsync(async (req, res, next) => {
  const thread = await Thread.create({ ...req.body, author: req.user });

  res.status(201).json({
    status: 'sucess',
    data: thread,
  });
});

exports.createThreadWithIntialPost = catchAsync(async (req, res, next) => {
  // This catch is not being used in the front end, but I'm leaving it as note to self
  // for later. If I wanted to catch the mongoose validator error and send it to the
  // front end as JSON this would be how
  const thread = await Thread.create({ ...req.body, author: req.user }).catch(
    (err) => {
      const errorMsg = err.errors.title.properties.message;
      sendErrorJson(res, errorMsg, 401);
    }
  );

  const post = await Post.create({
    ...req.body,
    thread: thread._id,
    author: req.user,
    isInitialPost: true,
  });

  const finalThreadData = await Thread.findByIdAndUpdate(
    thread._id,
    { initialPost: post._id },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    status: 'sucess',
    data: finalThreadData,
  });
});

// exports.getThread = factory.getOne(Thread, 'thread');

exports.editThread = factory.updateOne(Thread, ['initialPost']);

function getNextUrl(req, count) {
  const { limit, page } = req.query;
  const { originalUrl } = req;

  console.log({ originalUrl });

  const pageNumber = +page;
  const totalPages = Math.ceil(count / limit);
  const nextPage = pageNumber + 1;

  const [baseUrl, reqParams] = originalUrl.split('?');

  // The first index of the reqParams is the page param, which we don't need
  const [, ...otherParams] = reqParams.split('&');

  const nextUrl = `${baseUrl}?page=${nextPage}&${otherParams.join('&')}`;

  // If the next page is greater than total pages there are no results so we return null,
  // otherwise we return the nextUrl string
  return nextPage <= totalPages ? nextUrl : null;
}

exports.getAllThreads = catchAsync(async (req, res, next) => {
  const countQuery = Thread.count({});

  const threadsQuery = new APIFeatures(
    Thread.find({}).populate('initialPost group numComments'),
    req.query
  )
    .sort()
    .paginate();

  const [count, threads] = await Promise.all([countQuery, threadsQuery.query]);

  const nextUrl = getNextUrl(req, count);

  res.status(200).json({
    status: 'success',
    data: { threads, next: nextUrl },
  });
});

exports.getAllThreadsFromGroup = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;

  const countQuery = Thread.count({ group: { $eq: groupId } });

  const threadsQuery = new APIFeatures(
    Thread.find({ group: { $eq: groupId } }).populate(
      'initialPost group numComments'
    ),
    req.query
  )
    .sort()
    .paginate();

  const [count, threads] = await Promise.all([countQuery, threadsQuery.query]);
  const nextUrl = getNextUrl(req, count);

  res.status(200).json({ status: 'success', data: { threads, next: nextUrl } });
});

exports.getThread = catchAsync(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread)
    return next(new AppError('There is no thread with that id', 400));

  const initialPost = await Post.findById(thread.initialPost.toString(), null, {
    shouldFetchReplies: true,
  });

  res
    .status(200)
    .json({ status: 'success', data: { thread, posts: initialPost } });
});
