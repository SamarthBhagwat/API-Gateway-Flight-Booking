const { UserService } = require('../services/');
const {StatusCodes} = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/response/');

const userService = new UserService();

class UserController{

    async create(req, res) {
        const userData = req.body;
        try {
            const user = await userService.create(userData);
            SuccessResponse.data = user;
            res.status(StatusCodes.CREATED).send(SuccessResponse);
        } catch (error) {
            ErrorResponse.error = error;
            res.status(error.statusCode).send(ErrorResponse);
        }
    }
    
}


module.exports = UserController;