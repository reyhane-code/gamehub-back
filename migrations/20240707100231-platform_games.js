"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("plarform_games", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "games", key: "id" },
      },
      plarform_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "plarforms", key: "id" },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("plarform_games");
  },
};
