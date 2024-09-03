'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('articles', [
      {
        title: 'Article One',
        content: `Article One Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa maxime necessitatibus hic illum deserunt velit alias aliquid sed doloribus error. Neque, eveniet?`,
        user_id: 1,
        createdAt: new Date(),
      },
      {
        title: 'Article Two',
        content: `Article Tow Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa maxime necessitatibus hic illum deserunt velit alias aliquid sed doloribus error. Neque, eveniet?`,
        user_id: 1,
        createdAt: new Date(),
      },
      {
        title: 'Article Three',
        content: `Article Three
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa maxime necessitatibus hic illum deserunt velit alias aliquid sed doloribus error.`,
        user_id: 1,
        createdAt: new Date(),
      },
      {
        title: 'Article Four',
        content: `Article Four 
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa maxime necessitatibus hic illum deserunt velit alias aliquid sed doloribus error. Neque, eveniet?`,
        user_id: 1,
        createdAt: new Date(),
      },
      {
        title: 'Article Five',
        content: `Article Five Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa maxime necessitatibus hic illum deserunt velit alias aliquid sed doloribus error. Neque, eveniet?`,
        user_id: 1,
        createdAt: new Date(),
      },
      {
        title: 'Article Six',
        content: `Article Six
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa maxime necessitatibus hic illum deserunt velit alias aliquid sed doloribus error.`,
        user_id: 1,
        createdAt: new Date(),
      },
      {
        title: 'Article Seven',
        content: `Article Seven
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa maxime necessitatibus.`,
        user_id: 1,
        createdAt: new Date(),
      },
      {
        title: 'Article Eight',
        content: `Article Eight Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium harum, debitis dolorum sapiente itaque quasi ea culpa.`,
        user_id: 1,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('articles', null, {});
  },
};
