"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("genre_games", [
      {
        game_id: 1,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 2,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 1,
        genre_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("genre_games", null, {});
  },
};
