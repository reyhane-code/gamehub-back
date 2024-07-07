"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        username: "reyhan",
        phone: "09055938814",
        email: "reyhane.code@gamil.com",
        password: "1383r1383",
        first_name: "reyhane",
        last_name: "javidi",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: "morty",
        phone: "09363080321",
        email: "mortezahatamikia.code@gamil.com",
        password: "",
        first_name: "morteza",
        last_name: "hatamikia",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
