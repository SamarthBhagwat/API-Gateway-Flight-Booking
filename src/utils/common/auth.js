const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../../config');

function checkPassword(plainPassword, encryptedPassword){
    try {
        return bcrypt.compareSync(plainPassword, encryptedPassword);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


function createJWTToken(input){
    try {
        return jwt.sign(input, ServerConfig.JWT_SECRET_KEY, {expiresIn: ServerConfig.JWT_EXPIRY}); 
    } catch (error) {
        console.log(error);
        throw error;
    }
}


function verifyJWTToken(jwtToken){
    try {
        return jwt.verify(jwtToken, ServerConfig.JWT_SECRET_KEY);    
    } catch (error) {
        console.log("Error ," , error);
        throw error;   
    }
}


module.exports = {
    checkPassword, 
    createJWTToken,
    verifyJWTToken
}