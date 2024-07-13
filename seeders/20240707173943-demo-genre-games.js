'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('genre_games', [
      {
        game_id: 1,
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
      {
        game_id: 2,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 2,
        genre_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 3,
        genre_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 3,
        genre_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 4,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 5,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 5,
        genre_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 6,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 6,
        genre_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 7,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 8,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 9,
        genre_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 9,
        genre_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 9,
        genre_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 9,
        genre_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        game_id: 10,
        genre_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('genre_games', null, {});
  },
};
