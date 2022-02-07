const express = require('express');
const groupController = require('../controllers/groupController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(protect, groupController.createGroup)
  .get(groupController.getAllGroups);

router
  .route('/:id')
  .get(groupController.getGroup)
  .patch(protect, groupController.updateGroup);

module.exports = router;
