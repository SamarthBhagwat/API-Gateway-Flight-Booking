'use strict';
const {USER_ROLES_ENUMS} = require('../utils/common/enum');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.ENUM,
        values: [USER_ROLES_ENUMS.CUSTOMER, USER_ROLES_ENUMS.ADMIN, USER_ROLES_ENUMS.FLIGHT_COMPANY],
        defaultValue: USER_ROLES_ENUMS.CUSTOMER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};