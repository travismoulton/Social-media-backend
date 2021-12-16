const express = require('express');
const membershipController = require('../controllers/membershipController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:groupId')
  .post(authController.protect, membershipController.createMembership)
  .delete(authController.protect, membershipController.removeMembership);

module.exports = router;
