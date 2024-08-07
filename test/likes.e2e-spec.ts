import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Context } from './utils/context';
import { LikeAbleEntity, TableName } from 'src/enums/database.enum';
import { ValidationPipe } from '@nestjs/common';
import { createAdminUser } from './utils/admin';
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

describe('Games System (e2e)', () => {
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

  const like = async (
    status: number = 200,
    entityType: LikeAbleEntity,
    entityId: number,
  ) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .post(`/likes/${entityType}/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const unlike = async (
    status: number = 200,
    entityType: LikeAbleEntity,
    entityId: number,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .delete(`/likes/${entityType}/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getLIkes = async (
    status: number = 200,
    entityType: LikeAbleEntity,
    entityId: number,
  ) => {
    return request(app.getHttpServer())
      .get(`/likes/${entityType}/${entityId}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUserLikes = async (
    accessToken: string,
    status: number = 200,
    entityType: LikeAbleEntity,
  ) => {
    return request(app.getHttpServer())
      .get(`/likes/user/${entityType}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('likes a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
      background_image: 'bullshiturl1',
    });
    await like(201, LikeAbleEntity.GAME, game.id);
  });

  it('returns confilct when liking more than once', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
      background_image: 'bullshiturl1',
    });
    await like(201, LikeAbleEntity.GAME, game.id);
    await like(409, LikeAbleEntity.GAME, game.id);
  });

  it('unlikes a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
      background_image: 'bullshiturl1',
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await request(app.getHttpServer())
      .post(`/likes/game/${game.id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(201)
      .then((res) => res.body);

    unlike(200, LikeAbleEntity.GAME, game.id, accessToken);
  });

    // it('returns error while deleting a non-existing game', async () => {
      // await deleteGame(404, 21);
    // });

  //   it('finds all games', async () => {
  //     await addGame(201, {
  //       name: 'game1',
  //       description: 'desc1',
  //       metacritic: 200,
  //       background_image: 'bullshiturl1',
  //     });
  //     await addGame(201, {
  //       name: 'game2',
  //       description: 'desc2',
  //       metacritic: 200,
  //       background_image: 'bullshiturl2',
  //     });
  //     await addGame(201, {
  //       name: 'game3',
  //       description: 'desc3',
  //       metacritic: 200,
  //       background_image: 'bullshiturl3',
  //     });
  //     const games = await request(app.getHttpServer())
  //       .get('/games')
  //       .expect(200)
  //       .then((res) => res.body);
  //     expect(games).toBeDefined();
  //   });

  //   it('returns error if there is no game when finding games', async () => {
  //     return request(app.getHttpServer())
  //       .get('/games')
  //       .expect(404)
  //       .then((res) => res.body);
  //   });

  //   it('finds game by slug', async () => {
  //     const game = await addGame(201, {
  //       name: 'game4',
  //       description: 'desc4',
  //       metacritic: 200,
  //       background_image: 'bullshiturl4',
  //     });
  //     await getGameBySlug(200, game.slug);
  //   });

  //   it('returns an error if the game does not exist when finding by slug', async () => {
  //     await getGameBySlug(404, 'bullshit');
  //   });

  //   it('returns error if user is not admin when finding user games', async () => {
  //     const accessToken = 'dummyAccessTokenForTesting';
  //     await addGame(201, DEFAULT_GAME);
  //     await getUsergames(accessToken, 401);
  //   });

  //   it('finds user games', async () => {
  //     const accessToken = await createAdminUser(app);
  //     const genre = await addGenre(app, 201, { name: 'new-genre' });
  //     const platform = await addPlatform(app, 201, { name: 'new-platform' });
  //     const publisher = await addPublisher(app, 201, { name: 'new-publisher' });
  //     await request(app.getHttpServer())
  //       .post('/games')
  //       .set('authorization', `Bearer ${accessToken}`)
  //       .send({
  //         name: 'game1',
  //         description: 'desc1',
  //         metacritic: 200,
  //         background_image: 'bullshiturl1',
  //         platformId: platform.id,
  //         genreId: genre.id,
  //         publisherId: publisher.id,
  //       })
  //       .expect(201)
  //       .then((res) => res.body);
  //     const games = await getUsergames(accessToken, 200);
  //     expect(games.length).toEqual(1);
  //     expect(games).toBeDefined();
  //   });
});
