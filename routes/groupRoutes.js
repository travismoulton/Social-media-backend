const express = require('express');
const groupController = require('../controllers/groupController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.route('/').post(protect, groupController.createGroup);

router
  .route('/:id')
  .get(protect, groupController.getGroup)
  .patch(protect, groupController.updateGroup);

module.exports = router;
