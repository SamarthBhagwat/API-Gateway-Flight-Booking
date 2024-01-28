const BasicCRUDRepository = require('./crud-repository');
const { Role } = require('../models/');

class RoleRepository extends BasicCRUDRepository{
    constructor(){
        super(Role);
    }

    async getRoleByName(name){
        const user = await Role.findOne({
            where:{
                name: name
            }
        });
        return user;
    }
}


module.exports = RoleRepository;