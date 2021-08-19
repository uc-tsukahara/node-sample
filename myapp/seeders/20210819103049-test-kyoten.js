'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('KYOTEN_TBLs', [
      {
        kyotenName: '東京',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        kyotenName: '千葉',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        kyotenName: '神奈川',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        kyotenName: '埼玉',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        kyotenName: '茨城',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('KYOTEN_TBLs', null, {});
  }
};
