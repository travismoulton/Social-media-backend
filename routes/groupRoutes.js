const express = require('express');
const groupController = require('../controllers/groupController');
const authController = require('../controllers/authController');

const { protect } = authController;

const router = express.Router();

router.route('/').post(protect, groupController.createGroup);

router.route('/:id').get(protect, groupController.getGroup);

module.exports = router;
