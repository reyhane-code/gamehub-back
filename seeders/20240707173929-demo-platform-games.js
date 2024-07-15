'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('platform_games', [
      {
        game_id: 1,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 1,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 1,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 1,
        platform_id: 4,
        createdAt: new Date(),
      },
      {
        game_id: 1,
        platform_id: 5,
        createdAt: new Date(),
      },
      {
        game_id: 2,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 2,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 3,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 4,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 4,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 4,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 4,
        platform_id: 4,
        createdAt: new Date(),
      },
      {
        game_id: 4,
        platform_id: 5,
        createdAt: new Date(),
      },
      {
        game_id: 5,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 6,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 6,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 6,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 7,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 7,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 7,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 8,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 8,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 8,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 9,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 9,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 9,
        platform_id: 3,
        createdAt: new Date(),
      },
      {
        game_id: 9,
        platform_id: 4,
        createdAt: new Date(),
      },
      {
        game_id: 9,
        platform_id: 5,
        createdAt: new Date(),
      },
      {
        game_id: 10,
        platform_id: 1,
        createdAt: new Date(),
      },
      {
        game_id: 10,
        platform_id: 2,
        createdAt: new Date(),
      },
      {
        game_id: 10,
        platform_id: 3,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('platform_games', null, {});
  },
};
