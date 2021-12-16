const express = require('express');
const postController = require('../controllers/postController');
const { protect } = require('../controllers/authController');

// const { protect } = authController;

const router = express.Router();

router.route('/').post(protect, postController.createPost);

router.route('/:id').get(protect, postController.getPost);

module.exports = router;
