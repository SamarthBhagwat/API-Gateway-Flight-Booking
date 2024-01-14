const { UserRepository } = require('../repositories/');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const { AuthUtility } = require('../utils/common');

const userRepository = new UserRepository();

class UserService{

    async signup(data){
        try {
            const user = await userRepository.create(data);
            return user;    
        } catch (error) {
            console.log(error);
            if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
                let error_array = error.errors;
                let explanation = [];
                error_array.forEach(element => {
                    explanation.push(element.message);
                });
                const appError = new AppError(explanation, StatusCodes.BAD_REQUEST);
                throw appError;
            } 
            else{
                const appError = new AppError("Internal Server error", StatusCodes.INTERNAL_SERVER_ERROR);
                throw appError;
            }  
        }
    }

    async signin(data){
        try {
            // 1. Check whether there is a user with the same email or not 
            const user = await userRepository.getUserByEmail(data.email);
            if(!user){
                throw new AppError("No user found for given email", StatusCodes.NOT_FOUND);
            }

            // 2. Compare the encrypted password stored in db for user with the plain password sent in data 
            const isPasswordMatched = AuthUtility.checkPassword(data.password, user.password);
            console.log("IS password matched " , isPasswordMatched);
            if(isPasswordMatched){
                // Generate a JWT Token and send it to the client
                const jwtToken = AuthUtility.createJWTToken({
                    id: user.id,
                    email: user.email
                });
                return jwtToken;
            }
            else{
                throw new AppError("Authentication failed" , StatusCodes.UNAUTHORIZED);
            }

        } catch (error) {
            if(error instanceof AppError){
                throw error;
            }
            console.log(error);
            throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }


    async isAuthenticated(jwtToken){
        try {
            if(!jwtToken){
                throw new AppError("Missing JWT Token", StatusCodes.BAD_REQUEST);
            }

            const response = AuthUtility.verifyJWTToken(jwtToken);
            // Extra step, can be skipped but it is good for verification
            // Verify whether user present in db
            const user = await userRepository.findByPk(response.id);
            if(!user){
                throw new AppError("No user found", StatusCodes.UNAUTHORIZED);
            }

            return user.id;

        } catch (error) {
            if(error.name == 'JsonWebTokenError'){
                throw new AppError('Invalid JWT Token', StatusCodes.UNAUTHORIZED);
            }
            console.log(error);
            throw error;
        }
    }
}

module.exports = UserService;