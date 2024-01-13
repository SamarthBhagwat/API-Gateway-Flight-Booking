const {AppError} = require('../utils/error');
const {StatusCodes} = require('http-status-codes');
const {ErrorResponse} = require('../utils/response');

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
}



module.exports = AuthMiddleware;