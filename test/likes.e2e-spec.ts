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

describe('Likes System (e2e)', () => {
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
    status: number = 201,
    entityType: LikeAbleEntity,
    entityId: number,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .post(`/likes/${entityType}/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const unlike = async (
    status: number,
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

  const getLikes = async (
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
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await like(201, LikeAbleEntity.GAME, game.id, accessToken);
  });

  it('returns confilct when liking more than once', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await like(201, LikeAbleEntity.GAME, game.id, accessToken);
    await like(409, LikeAbleEntity.GAME, game.id, accessToken);
  });

  it('unlikes a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await request(app.getHttpServer())
      .post(`/likes/game/${game.id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(201)
      .then((res) => res.body);

    unlike(200, LikeAbleEntity.GAME, game.id, accessToken);
  });

  it('returns error if unliking sth that user did not like', async () => {
    const game = await addGame(app, 201, {
      name: 'game35',
      description: 'desc35',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await unlike(401, LikeAbleEntity.GAME, game.id, accessToken);
  });

  it('finds all likes for a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await like(201, LikeAbleEntity.GAME, game.id, accessToken);

    const likes = await getLikes(200, LikeAbleEntity.GAME, game.id);
    expect(likes.data).toBeDefined();
  });

  it('returns error if game has no likes', async () => {
    return request(app.getHttpServer())
      .get('/likes/game/258')
      .expect(404)
      .then((res) => res.body);
  });

  it('finds user liked games', async () => {
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

    await like(201, LikeAbleEntity.GAME, game.id, accessToken);
    await like(201, LikeAbleEntity.GAME, game2.id, accessToken);

    const likes = await getUserLikes(accessToken, 200, LikeAbleEntity.GAME);
    expect(likes.data).toBeDefined();
  });

  it('it returns error if user didnt like any game while getting user likes', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    await getUserLikes(accessToken, 404, LikeAbleEntity.GAME);
  });
});
