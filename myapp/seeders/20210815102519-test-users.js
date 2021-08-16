'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('USER_TBLs', [
      {
        userName: 'test1',
        password: bcrypt.hashSync('secret1', bcrypt.genSaltSync(8)),
        email: 'test1@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test2',
        password: bcrypt.hashSync('secret2', bcrypt.genSaltSync(8)),
        email: 'test2@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test3',
        password: bcrypt.hashSync('secret3', bcrypt.genSaltSync(8)),
        email: 'test3@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test4',
        password: bcrypt.hashSync('secret4', bcrypt.genSaltSync(8)),
        email: 'test4@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'test5',
        password: bcrypt.hashSync('secret5', bcrypt.genSaltSync(8)),
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