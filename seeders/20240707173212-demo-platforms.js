'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('platforms', [
      {
        name: 'PlayStation 5',
        slug: 'playstation5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Xbox Series S/X',
        slug: 'xbox-series-x',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'PC',
        slug: 'pc',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Xbox One',
        slug: 'xbox-one',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'PlayStation 4',
        slug: 'playstation4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nintendo Switch',
        slug: 'nintendo_swich',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'IOS',
        slug: 'ios',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Android',
        slug: 'android',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('platforms', null, {});
  },
};
