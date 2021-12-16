const express = require('express');
const threadContoller = require('../controllers/threadController');
const authController = require('../controllers/authController');

const { protect } = authController;

const router = express.Router();

router.route('/').post(protect, threadContoller.createThread);

router.route('/:id').get(protect, threadContoller.getThread);

module.exports = router;
