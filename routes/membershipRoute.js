const express = require('express');
const membershipController = require('../controllers/membershipController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router
  .route('/:groupId')
  .post(protect, membershipController.createMembership)
  .delete(protect, membershipController.removeMembership);

router.route('/userGroups').get(protect, membershipController.getUserGroups);

module.exports = router;
