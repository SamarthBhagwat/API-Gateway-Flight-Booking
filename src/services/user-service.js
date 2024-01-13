const { UserRepository } = require('../repositories/');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

const userRepository = new UserRepository();

class UserService{

    async create(data){
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

}

module.exports = UserService;