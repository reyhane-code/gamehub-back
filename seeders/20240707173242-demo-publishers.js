"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("publishers", [
      {
        name: "publisher1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "publisher2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("publishers", null, {});
  },
};
