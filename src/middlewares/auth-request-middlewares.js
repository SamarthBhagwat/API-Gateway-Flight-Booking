const {AppError} = require('../utils/error');
const {StatusCodes} = require('http-status-codes');
const {ErrorResponse} = require('../utils/response');
const { UserService } = require('../services');

const userService = new UserService();

class AuthMiddleware{
    
    validateAuthRequest(req, res, next){
        if(!req.body.email){
            let explanation = [];
            explanation.push("Email not found in request body");
            const appError = new AppError(explanation, StatusCodes.BAD_REQUEST);
            ErrorResponse.error = appError; 
            return res.status(ErrorResponse.error.statusCode).send(ErrorResponse);
        }
    
        if(!req.body.password){
            let explanation = [];
            explanation.push("Password not found in request body");
            const appError = new AppError(explanation, StatusCodes.BAD_REQUEST);
            ErrorResponse.error = appError; 
            return res.status(ErrorResponse.error.statusCode).send(ErrorResponse);
        }
    
        next();
    }

    async checkAuth(req, res, next){
        try {
            const isAuthenticated = await userService.isAuthenticated(req.headers['x-access-token']);
            if(isAuthenticated){
                req.user = isAuthenticated; // setting the user id in the request object
                next();
            }    
        } catch (error) {
            ErrorResponse.error = error;
            return res.status(error.statusCode).send(ErrorResponse);
        }
    
    }
}



module.exports = AuthMiddleware;