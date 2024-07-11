'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('genres', [
      {
        name: 'Action',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'RPG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Strategy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Shooter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Advanture',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Puzzle',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Racing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sports',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('genres', null, {});
  },
};
