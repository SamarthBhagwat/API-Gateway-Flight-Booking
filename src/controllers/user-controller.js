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

    async signup(req, res) {
        const userData = req.body;
        try {
            const email = userData.email;
            const password = userData.password;
            const user = await userService.signup({
                'email': email,
                'password': password
            });
            SuccessResponse.data = user;
            res.status(StatusCodes.CREATED).send(SuccessResponse);
        } catch (error) {
            ErrorResponse.error = error;
            res.status(error.statusCode).send(ErrorResponse);
        }
    }
    
    async signin(req, res){
        const userData = req.body;
        try {
            const email = userData.email;
            const password = userData.password;
            const jwtToken = await userService.signin({
                email: email,
                password: password
            });
            SuccessResponse.data = jwtToken;
            res.status(StatusCodes.OK).send(SuccessResponse); 
        } catch (error) {
            ErrorResponse.error = error;
            res.status(error.statusCode).send(ErrorResponse);
        }
    }

    async addRoleToUser(req, res){ 
        const userData = req.body;
        try {
            const role = userData.role;
            const id = userData.id;
            const jwtToken = await userService.addRoleToUser({
                role: role,
                id: id
            });
            SuccessResponse.data = jwtToken;
            res.status(StatusCodes.OK).send(SuccessResponse); 
        } catch (error) {
            ErrorResponse.error = error;
            res.status(error.statusCode).send(ErrorResponse);
        }
    }
}


module.exports = UserController;