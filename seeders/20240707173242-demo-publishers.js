'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('publishers', [
      {
        name: 'Paradox Interactive',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Sony',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Coffee Stain Studios',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Ubisoft Entertainment',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Devolver Digital',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Ubisoft Entertainment',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Bokeh Game Studio',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Bandai Namco Entertainment',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: '505 Games',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'PLAION',
        user_id: 1,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('publishers', null, {});
  },
};
