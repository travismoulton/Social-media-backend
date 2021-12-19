const express = require('express');
const postController = require('../controllers/postController');
const likesController = require('../controllers/likesController');
const { protect } = require('../controllers/authController');

// const { protect } = authController;

const router = express.Router();

router.route('/').post(protect, postController.createPost);

router.route('/:id').get(protect, postController.getPost);

router.route('/:id/like').post(protect, likesController.addLike);
router.route('/:id/dislike').post(protect, likesController.addDislike);

module.exports = router;
