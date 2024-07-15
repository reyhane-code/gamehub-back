'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('publishers', [
      {
        name: 'Paradox Interactive',
        createdAt: new Date(),
      },
      {
        name: 'Sony',
        createdAt: new Date(),
      },
      {
        name: 'Coffee Stain Studios',
        createdAt: new Date(),
      },
      {
        name: 'Ubisoft Entertainment',
        createdAt: new Date(),
      },
      {
        name: 'Devolver Digital',
        createdAt: new Date(),
      },
      {
        name: 'Ubisoft Entertainment',
        createdAt: new Date(),
      },
      {
        name: 'Bokeh Game Studio',
        createdAt: new Date(),
      },
      {
        name: 'Bandai Namco Entertainment',
        createdAt: new Date(),
      },
      {
        name: '505 Games',
        createdAt: new Date(),
      },
      {
        name: 'PLAION',
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('publishers', null, {});
  },
};
