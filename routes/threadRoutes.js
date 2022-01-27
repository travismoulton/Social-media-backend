const express = require('express');
const threadContoller = require('../controllers/threadController');
const authController = require('../controllers/authController');

const { protect } = authController;

const router = express.Router();

router
  .route('/')
  .post(protect, threadContoller.createThreadWithIntialPost)
  .get(threadContoller.getAllThreads);

router
  .route('/:id')
  .get(protect, threadContoller.getThread)
  // This needs to be changed. Just doing a quick route for now to test
  // reply chaining functionality
  .patch(protect, threadContoller.editThread);

module.exports = router;
