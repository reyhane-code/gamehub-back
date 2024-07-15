'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('genres', [
      {
        name: 'Action',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'RPG',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Strategy',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Shooter',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Advanture',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Puzzle',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Racing',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Sports',
        user_id: 1,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('genres', null, {});
  },
};
