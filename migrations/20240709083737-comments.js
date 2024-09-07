'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'games', key: 'id' },
      },
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'articles', key: 'id' },
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'comments', key: 'id' },
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comments');
  },
};
