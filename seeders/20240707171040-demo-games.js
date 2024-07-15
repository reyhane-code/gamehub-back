'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('games', [
      //1
      {
        name: 'Vampire: The Masquerade - Bloodlines 2',
        description: `Sired in an act of vampire insurrection, your existence ignites the war for Seattle's blood trade. Enter uneasy alliances with the creatures who control the city and uncover the sprawling conspiracy which plunged Seattle into a bloody civil war between powerful vampire factions.
        ♞Become the Ultimate Vampire
        Immerse yourself in the World of Darkness and live out your vampire fantasy in a city filled with intriguing characters that react to your choices. You and your unique disciplines are a weapon in our forward-driving, fast-moving, melee-focussed combat system. Your power will grow as you advance, but remember to uphold the Masquerade and guard your humanity... or face the consequences.
        ♝Descend into Seattle’s Dark Heart and Survive the Vampire Elite
        Seattle has always been run by vampires. Hunt your prey across Seattle locations faithfully reimagined in the World of Darkness. Meet the old blood founders present since the city’s birth and the new blood steering the tech money redefining the city.`,
        slug: 'vampire-bloodlines2',
        background_image:
          'https://uploadkon.ir/uploads/92de13_24vampire-masquerade-bloodlines2-ps5-wallpapers-07.jpg',
        rating_top: 1,
        metacritic: 316,
        user_id: 1,
        createdAt: new Date(),
      },
      //2
      {
        name: 'V Rising',
        description: `A Vampire Survival Experience
        Awaken as a weakened vampire after centuries of slumber. Hunt for blood in nearby settlements to regain your strength while hiding from the scorching sun to survive. Rebuild your castle and convert humans into your loyal servants in a quest to raise your vampire empire. Make allies online, fend off holy soldiers, and wage war against other players in a world of conflict.`,
        slug: 'v-rising',
        background_image:
          'https://uploadkon.ir/uploads/e57513_24HD-wallpaper-video-game-v-rising.jpg',
        rating_top: 2,
        metacritic: 62,
        user_id: 1,
        createdAt: new Date(),
      },
      //3
      {
        name: 'Songs of Conquest',
        description: `Songs of Conquest is a turn based game where you build a kingdom, raise armies and control powerful magicians called wielders. You’ll quest around for loot, fight monsters, optimize build orders and strategies to pick off the enemy teams. We call it Classic Adventure Strategy, for short. Combat will be a major part of the game. You’ll recruit troops and your wielders will command them on the battlefield. The wielders harness a magic called “The essence”. By combining your wielders skills with the essence of the troops you get access to powerful spells.`,
        slug: 'songs-of-conquest',
        background_image:
          'https://uploadkon.ir/uploads/b4ec13_24EGS-SongsofConquest-Lavapotion-S1-2560x1440-fa8ea8f7cebfc72538f205aab8649839.jpeg',
        rating_top: 49,
        metacritic: 819,
        user_id: 1,
        createdAt: new Date(),
      },
      //4
      {
        name: 'Prince of Persia: The Sands of Time Remake',
        description: `Songs of Conquest is a turn based game where you build a kingdom, raise armies and control powerful magicians called wielders. You’ll quest around for loot, fight monsters, optimize build orders and strategies to pick off the enemy teams. We call it Classic Adventure Strategy, for short. Combat will be a major part of the game. You’ll recruit troops and your wielders will command them on the battlefield. The wielders harness a magic called “The essence”. By combining your wielders skills with the essence of the troops you get access to powerful spells.`,
        slug: 'princ-of-persia-the-sands-of-time-remake',
        background_image:
          'https://uploadkon.ir/uploads/289f13_24HD-wallpaper-poster-of-prince-of-persia-the-sands-of-time-remake.jpg',
        rating_top: 52,
        metacritic: 2210,
        user_id: 1,
        createdAt: new Date(),
      },
      //5
      {
        name: 'Anger Foot',
        description: `Anger Foot is a lightning-fast hard bass blast of kicking doors and kicking ass. Crash through the caffeine-fueled fever dream of Shit City, putting the boot to a menacing menagerie of merciless gangsters.
        Unleash the world's deadliest feet on a colorful cast of anthropomorphic enemies. Clearing out slums, sewers, and skyscrapers as you grab new weapons, unlock new sneakers, and upgrade your powers in absurd and wonderful ways. Kick and shoot your way to the exit as you leave behind a smoldering trail of shattered doors, broken bones, and crumpled energy drinks.Fast-Paced Ass Kicking ActionShit City is a disease and your foot is the cure. Lace-up a capricious collection of formidable footwear to fight through a diverse series of deranged city districts.Vibrant Visuals, Relentless BeatsEnjoy a concussive, bass-thumping soundtrack as you stampede through a feverish criminal underworld. An assault on all your senses. Including common sense.Run. Kick. RepeatAre you the god of style, speed, or power? Discover secrets and unlocks that encourage replayability - and learn to tackle levels in new creative, ridiculous, and devastating ways.Master The FootBecome one with the toes and be quick on the trigger. Your skills must surpass human comprehension if you are to prevail and learn the secret of the Anger Foot.`,
        slug: 'anger-foot',
        background_image:
          'https://uploadkon.ir/uploads/fb6613_24da93ffb65843f39b240ffd97c07a3acb.jpg',
        rating_top: 53,
        metacritic: 974,
        user_id: 1,
        createdAt: new Date(),
      },
      //6
      {
        name: 'Star Wars Outlaws',
        description:
          'Set between the events of Star Wars: The Empire Strikes Back and Star Wars: Return of the Jedi, players will step into the role of Kay Vess, a clever scoundrel in the galactic underworld. In Star Wars Outlaws, Kay is looking to attempt one of the biggest heists the Outer Rim has ever seen, all in an effort to start a new life.',
        slug: 'star-wars-outlaws',
        background_image:
          'https://uploadkon.ir/uploads/bb7513_24853aa2b76ae85fcf2782ace58cf7479f.jpg',
        rating_top: 50,
        metacritic: 4457,
        user_id: 1,
        createdAt: new Date(),
      },
      //7
      {
        name: 'Slitterhead',
        description:
          'Slitterhead is an action game developed by Bokeh Game Studio. It is set to come out in 2024. The game is rated as "Recommended" on RAWG. Slitterhead is available on Xbox Series S/X, PC and PlayStation 5. It was produced by Geoff Keighley. It was scored by Geoff Keighley.',
        slug: 'slitterhead',
        background_image:
          'https://uploadkon.ir/uploads/6bdd13_2428d602abdd520db08fb78ab931259be0.jpg',
        rating_top: 81,
        metacritic: 8645,
        user_id: 1,
        createdAt: new Date(),
      },
      //8
      {
        name: 'DRAGON BALL: Sparking! ZERO',
        description: `DRAGON BALL: Sparking! ZERO takes the legendary gameplay of the Budokai Tenkaichi series and raises it to whole new levels. DRAGON BALL: Sparking! ZERO has an incredible number of playable characters, each with signature abilities, transformations and techniques. Unleash the fighting spirit within you and take the fight to arenas that crumble and react to your power as the battle rages on.`,
        slug: 'dragon-ball-sparking-zero',
        background_image:
          'https://uploadkon.ir/uploads/4e0713_2464fdee7e7b863fbc22460cb8e38614b9.jpg',
        rating_top: 198,
        metacritic: 523,
        user_id: 1,
        createdAt: new Date(),
      },
      //9
      {
        name: 'Eiyuden Chronicle: Hundred Heroes',
        description: `Our story begins in one corner of Allraan, a tapestry of nations with diverse cultures and values.
        By dint of sword, and by way of magical objects known as “rune-lenses, the land’s history has been shaped by the alliances and aggressions of the humans, beastmen, elves, and desert people who live there.
        
        The Galdean Empire has edged out other nations and discovered a technology that amplifies the rune-lenses’ magic.
        
        Now, the Empire is scouring the continent for an artifact that will expand their power even further.
        It is on one such expedition that Seign Kesling, a young and gifted imperial officer, and Nowa, a boy from a remote village, meet each other and become friends.`,
        slug: 'eiyuden-chronicle-hundred-heroes',
        background_image:
          'https://uploadkon.ir/uploads/4beb13_248b7ae9f5da33a75da7b5177587b8ca9d.jpg',
        rating_top: 64,
        metacritic: 2907,
        user_id: 1,
        createdAt: new Date(),
      },
      //10
      {
        name: 'Nobody Wants to Die',
        description: `Lose yourself in the world of New York, 2329, where immortality comes at a price that someone has to pay. Following a near-death experience, Detective James Karra takes an off-the-books case from his chief with only the help of a young police liaison, Sara Kai, to assist him. Time reveals all as they risk everything in pursuit of a killer, uncovering the dark secrets of the city's elite.
        Experience a noir adventure in an alternate future of New York City in 2329; technology has advanced to offer humans eternal life, allowing consciousness to be stored in memory banks or transferred from one body to another. That is, if you can afford the subscription.`,
        slug: 'nobody-wants-to-die',
        background_image:
          'https://uploadkon.ir/uploads/ce3c13_24d3d7496a03343bfbb79fda79a48e3e5a.jpg',
        rating_top: 0,
        metacritic: 12228,
        user_id: 1,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('games', null, {});
  },
};
