"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("platform_games", [
      {
        game_id: 1,
        platform_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 2,
        platform_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 1,
        platform_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("platform_games", null, {});
  },
};
