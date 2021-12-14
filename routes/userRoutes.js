const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.get('/user/:id', authController.protect, userController.getUser);

router.get('/logout', authController.logout);

module.exports = router;
