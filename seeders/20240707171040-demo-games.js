"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("games", [
      {
        id: 1,
        name: "Vampire: The Masquerade - Bloodlines 2",
        description: `Sired in an act of vampire insurrection, your existence ignites the war for Seattle's blood trade. Enter uneasy alliances with the creatures who control the city and uncover the sprawling conspiracy which plunged Seattle into a bloody civil war between powerful vampire factions.
        ♞Become the Ultimate Vampire
        Immerse yourself in the World of Darkness and live out your vampire fantasy in a city filled with intriguing characters that react to your choices. You and your unique disciplines are a weapon in our forward-driving, fast-moving, melee-focussed combat system. Your power will grow as you advance, but remember to uphold the Masquerade and guard your humanity... or face the consequences.
        ♝Descend into Seattle’s Dark Heart and Survive the Vampire Elite
        Seattle has always been run by vampires. Hunt your prey across Seattle locations faithfully reimagined in the World of Darkness. Meet the old blood founders present since the city’s birth and the new blood steering the tech money redefining the city. Everyone has hidden agendas - so choose your allies wisely.
        ♚Enter into Uneasy Alliances
        Choose a side among competing factions, each with their own unique traits and stories, in the war for Seattle’s blood trade. The world will judge you by the company you keep, but remember no one’s hands stay clean forever.
        ♛Experience the Story
        Written by the creative mind behind the original Bloodlines, Vampire: The Masquerade® - Bloodlines™ 2 brings the ambitions of the first game to life and sees the return of a few fan favorite characters.`,
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
