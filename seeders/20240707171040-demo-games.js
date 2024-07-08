"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("games", [
      {
        id: 1,
        name: "game1",
        description: "desc1",
        slug: "game1",
        background_image: "dummyurl",
        rating_top: "2",
        metacritic: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "game2",
        description: "desc2",
        slug: "game2",
        background_image: "dummyurl",
        rating_top: "5",
        metacritic: 55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("games", null, {});
  },
};
