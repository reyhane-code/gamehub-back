'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        username: 'reyhan',
        phone: '09055938814',
        email: 'reyhane.code@gamil.com',
        password:
          '$2b$10$Z4QdRa824cv1amge.Y34AeT0jNdRlJMMwNCg2VUr3oGAD04QkqKfa',
        first_name: 'reyhane',
        last_name: 'javidi',
        active: true,
        role: 'super',
        createdAt: new Date(),
      },
      {
        username: 'morty',
        phone: '09363080321',
        email: 'mortezahatamikia.code@gamil.com',
        password: '',
        first_name: 'morteza',
        last_name: 'hatamikia',
        active: true,
        role: 'super',
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
