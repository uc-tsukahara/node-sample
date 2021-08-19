'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('USER_TBLs', [
      {
        userName: 'test1',
        password: 'password1',
        email: 'test1@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test2',
        password: 'password2',
        email: 'test2@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test3',
        password: 'password3',
        email: 'test3@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test4',
        password: 'password4',
        email: 'test4@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test5',
        password: 'password5',
        email: 'test5@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('USER_TBLs', null, {});
  }
};