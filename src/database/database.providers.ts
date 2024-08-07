import { Bookmark } from 'models/bookmark.model';
import { Comment } from 'models/comment.model';
import { Game } from 'models/game.model';
import { GameFile } from 'models/game_file.model';
import { Genre } from 'models/genre.model';
import { GenreGame } from 'models/genre_game.model';
import { Like } from 'models/like.model';
import { Platform } from 'models/platform.model';
import { PlatformGame } from 'models/platform_game.model';
import { Publisher } from 'models/publisher.model';
import { PublisherGame } from 'models/publisher_game.model';
import { User } from 'models/user.model';
import { Sequelize } from 'sequelize-typescript';
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
      });
      await sequelize.authenticate();
      sequelize.addModels([
        User,
        Game,
        Genre,
        Platform,
        Publisher,
        GenreGame,
        PlatformGame,
        PublisherGame,
        Like,
        GameFile,
        Bookmark,
        Comment,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
