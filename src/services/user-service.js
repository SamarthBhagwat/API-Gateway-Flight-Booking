const { UserRepository, RoleRepository } = require('../repositories/');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const { AuthUtility } = require('../utils/common');
const { USER_ROLES_ENUMS } = require('../utils/common/enum');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

class UserService{

    async signup(data){
        try {
            const user = await userRepository.create(data);
            const role = await roleRepository.getRoleByName(USER_ROLES_ENUMS.CUSTOMER);
            await user.addRole(role);
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
            else if(error.name == 'TokenExpiredError'){
                throw new AppError('JWT token has expired', StatusCodes.UNAUTHORIZED);
            }
            console.log(error);
            throw error;
        }
    }

    async addRoleToUser(data){
        try {
            const user = await userRepository.findByPk(data.id);
            if(!user){
                throw new AppError("No user found for given id", StatusCodes.NOT_FOUND);
            }
            const role = await roleRepository.getRoleByName(data.role);
            if(!role){
                throw new AppError('No role found with the given name', StatusCodes.NOT_FOUND);
            }
            user.addRole(role); 
            return user;
        } catch (error) {
            if(error instanceof AppError) throw error;
            console.log(error);
            throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async isAdmin(id){
        try {
            const user = await userRepository.findByPk(id);
            if(!user){
                throw new AppError("No user found for given id", StatusCodes.NOT_FOUND);
            }
            const adminrole = await roleRepository.getRoleByName(USER_ROLES_ENUMS.ADMIN);
            if(!adminrole){
                throw new AppError('No role found with the given name', StatusCodes.NOT_FOUND);
            }
            return user.hasRole(adminrole);
        } catch (error) {
            if(error instanceof AppError) throw error;
            console.log(error);
            throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UserService;