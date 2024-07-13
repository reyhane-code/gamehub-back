'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('publisher_games', [
      {
        game_id: 1,
        publisher_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 2,
        publisher_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 3,
        publisher_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 4,
        publisher_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 5,
        publisher_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 6,
        publisher_id: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 7,
        publisher_id: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 8,
        publisher_id: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 9,
        publisher_id: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 10,
        publisher_id: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('publisher_games', null, {});
  },
};
