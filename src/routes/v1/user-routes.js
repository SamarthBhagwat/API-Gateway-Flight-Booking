const express = require('express');
const { UserController } = require('../../controllers');

const userController = new UserController();

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

module.exports = router;