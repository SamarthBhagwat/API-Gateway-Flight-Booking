const BasicCRUDRepository = require('./crud-repository');
const { User } = require('../models/');

class UserRepository extends BasicCRUDRepository{
    constructor(){
        super(User);
    }
}


module.exports = UserRepository;