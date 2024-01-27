'use strict';
const {USER_ROLES_ENUMS} = require('../utils/common/enum');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {through: 'User_Roles', as: 'user'});
    }
  }
  Role.init({
    name: {
      type: DataTypes.ENUM({
        values:[USER_ROLES_ENUMS.ADMIN, USER_ROLES_ENUMS.CUSTOMER, USER_ROLES_ENUMS.FLIGHT_COMPANY]
      }),
      allowNull: false,
      defaultValue: USER_ROLES_ENUMS.CUSTOMER
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};