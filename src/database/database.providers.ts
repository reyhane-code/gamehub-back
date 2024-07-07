import { Article } from 'models/article.model';
import { Bookmark } from 'models/bookmark.model';
import { Category } from 'models/category.model';
import { Comment } from 'models/comment.model';
import { Follower } from 'models/follower.model';
import { Like } from 'models/like.model';
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
      sequelize.addModels([User, Article, Category, Like, Bookmark, Follower, Comment ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
