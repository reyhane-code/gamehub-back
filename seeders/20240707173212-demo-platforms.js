'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('platforms', [
      {
        name: 'PlayStation 5',
        slug: 'playstation5',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Xbox Series S/X',
        slug: 'xbox-series-x',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'PC',
        slug: 'pc',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Xbox One',
        slug: 'xbox-one',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'PlayStation 4',
        slug: 'playstation4',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Nintendo Switch',
        slug: 'nintendo_swich',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'IOS',
        slug: 'ios',
        user_id: 1,
        createdAt: new Date(),
      },
      {
        name: 'Android',
        slug: 'android',
        user_id: 1,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('platforms', null, {});
  },
};
