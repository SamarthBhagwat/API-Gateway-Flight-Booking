const express = require('express');
const { UserController } = require('../../controllers');

const userController = new UserController();

const router = express.Router();

router.post('/', userController.create);

module.exports = router;