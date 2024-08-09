import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Context } from './utils/context';
import { BookmarkAbleEntity, TableName } from 'src/enums/database.enum';
import { ValidationPipe } from '@nestjs/common';
import { addGame } from './utils/add';
import { getValidationDataAndRegister } from './utils/login';

let context: Context;
beforeAll(async () => {
  context = await Context.getInstance();
});

beforeEach(async () => {
  return context.clean(Object.values(TableName));
});

// afterAll(() => {
//   return context.close();
// });

describe('Bookmarks System (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  const bookmark = async (
    status: number = 201,
    entityType: BookmarkAbleEntity,
    entityId: number,
  ) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .post(`/bookmarks/${entityType}/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const removeBookmark = async (
    status: number = 200,
    entityType: BookmarkAbleEntity,
    entityId: number,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .delete(`/bookmarks/${entityType}/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getBookmarks = async (
    status: number = 200,
    entityType: BookmarkAbleEntity,
    entityId: number,
  ) => {
    return request(app.getHttpServer())
      .get(`/bookmarks/${entityType}/${entityId}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUserBookmars = async (
    accessToken: string,
    status: number = 200,
    entityType: BookmarkAbleEntity,
  ) => {
    return request(app.getHttpServer())
      .get(`/bookmarks/user/${entityType}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('bookmarks a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    await bookmark(201, BookmarkAbleEntity.GAME, game.id);
  });

  it('returns confilct when bookmarking more than once', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    await bookmark(201, BookmarkAbleEntity.GAME, game.id);
    await bookmark(409, BookmarkAbleEntity.GAME, game.id);
  });

  it('unbookmarks a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await request(app.getHttpServer())
      .post(`/bookmarks/game/${game.id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(201)
      .then((res) => res.body);

    removeBookmark(200, BookmarkAbleEntity.GAME, game.id, accessToken);
  });

  // it('returns error while removing bookmark of sth user did not bookmark', async () => {
  //   const { accessToken } = await getValidationDataAndRegister(app);
  //   await removeBookmark(401, BookmarkAbleEntity.GAME, 21, accessToken);
  // });

  it('finds all bookmarks for a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });

    await bookmark(201, BookmarkAbleEntity.GAME, game.id);
    const bookmarks = await getBookmarks(200, BookmarkAbleEntity.GAME, game.id);
    expect(bookmarks.data).toBeDefined();
    expect(bookmarks.count).toEqual(1);
  });

  it('returns error if game has no bookmarks', async () => {
    return request(app.getHttpServer())
      .get('/bookmarks/game/258')
      .expect(404)
      .then((res) => res.body);
  });

  it('finds user bookmarked games', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const game2 = await addGame(app, 201, {
      name: 'game2',
      description: 'desc2',
      metacritic: 200,
    });

    await request(app.getHttpServer())
      .post(`/bookmarks/${BookmarkAbleEntity.GAME}/${game.id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(201)
      .then((res) => res.body);

    await request(app.getHttpServer())
      .post(`/bookmarks/${BookmarkAbleEntity.GAME}/${game2.id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(201)
      .then((res) => res.body);

    const bookmarks = await getUserBookmars(
      accessToken,
      200,
      BookmarkAbleEntity.GAME,
    );
    expect(bookmarks.data).toBeDefined();
    expect(bookmarks.count).toEqual(2);
  });

  it('it returns error if user didnt bookmark any game while getting user bookmarks', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    await getUserBookmars(accessToken, 404, BookmarkAbleEntity.GAME);
  });
});
