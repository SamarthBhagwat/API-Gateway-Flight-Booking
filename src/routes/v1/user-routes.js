const express = require('express');
const { UserController } = require('../../controllers');
const {AuthMiddleware} = require('../../middlewares');

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

const router = express.Router();

router.post('/signup', authMiddleware.validateAuthRequest, userController.signup);
router.post('/signin', authMiddleware.validateAuthRequest, userController.signin);
router.post('/role', authMiddleware.checkAuth, authMiddleware.isAdmin, userController.addRoleToUser);

module.exports = router;