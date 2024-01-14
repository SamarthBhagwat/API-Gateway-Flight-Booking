const express = require('express');

const { InfoController} = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');
const userRoutes = require('./user-routes');

const authMiddleware = new AuthMiddleware();

const router = express.Router();

router.get('/info', authMiddleware.checkAuth, InfoController.info);

router.use('/user' , userRoutes);

module.exports = router;