'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('SETSUBI_TBLs', [
      {
        setsubiName: '会議室1',
        kyotenId: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        setsubiName: '会議室2',
        kyotenId: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        setsubiName: '会議室3',
        kyotenId: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        setsubiName: '応接室1',
        kyotenId: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        setsubiName: '会議室1',
        kyotenId: '3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        setsubiName: '会議室1',
        kyotenId: '4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SETSUBI_TBLs', null, {});
  }
};
