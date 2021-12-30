const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.get('/logout', authController.logout);

router.post('/login', authController.login);

router.get('/checkForUser', authController.checkIfUserIsLoggedIn);

router.get('/:id', authController.protect, userController.getUser);

module.exports = router;
