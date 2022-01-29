const express = require('express');
const postController = require('../controllers/postController');
const likesController = require('../controllers/likesController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.route('/').post(protect, postController.createPost);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(protect, postController.editPostContent);

router.route('/:id/like/add').patch(protect, likesController.addLike);
router.route('/:id/dislike/add').patch(protect, likesController.addDislike);
router.route('/:id/like/remove').patch(protect, likesController.removeLike);
router
  .route('/:id/dislike/remove')
  .patch(protect, likesController.removeDislike);

module.exports = router;
