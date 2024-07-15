'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('genres', [
      {
        name: 'Action',
        createdAt: new Date(),
      },
      {
        name: 'RPG',
        createdAt: new Date(),
      },
      {
        name: 'Strategy',
        createdAt: new Date(),
      },
      {
        name: 'Shooter',
        createdAt: new Date(),
      },
      {
        name: 'Advanture',
        createdAt: new Date(),
      },
      {
        name: 'Puzzle',
        createdAt: new Date(),
      },
      {
        name: 'Racing',
        createdAt: new Date(),
      },
      {
        name: 'Sports',
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('genres', null, {});
  },
};
