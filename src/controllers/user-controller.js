const { UserService } = require('../services/');
const {StatusCodes} = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/response/');

const userService = new UserService();

/**
 *  /signup
 * 
 *  payload : {'email': 'test@gmail.com' , 'password': 'testPassword'}
 */

class UserController{

    async create(req, res) {
        const userData = req.body;
        try {
            const email = userData.email;
            const password = userData.password;
            const user = await userService.create({
                'email': email,
                'password': password
            });
            SuccessResponse.data = user;
            res.status(StatusCodes.CREATED).send(SuccessResponse);
        } catch (error) {
            console.log('Error in controller' , error);
            ErrorResponse.error = error;
            res.status(error.statusCode).send(ErrorResponse);
        }
    }
    
}


module.exports = UserController;