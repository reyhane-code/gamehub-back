import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Context } from './utils/context';
import { TableName } from 'src/enums/database.enum';
import { ValidationPipe } from '@nestjs/common';
import { createAdminUser } from './utils/admin';
import { toSlug } from 'src/helpers/helpers';
import { UpdateGameDto } from 'src/games/dtos/update-game.dto';
import { addGenre, addPlatform, addPublisher, addGame } from './utils/add';

const DEFAULT_GAME = {
  name: 'GAME default',
  description: 'description for the default game',
  metacritic: 20,
};

interface Game {
  name: string;
  description?: string;
  rating_top?: number;
  metacritic?: number;
}

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

  const updateGame = async (
    status: number = 200,
    id: number,
    body: UpdateGameDto,
  ) => {
    const accessToken = await createAdminUser(app);
    return request(app.getHttpServer())
      .put(`/games/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send(body)
      .expect(status)
      .then((res) => res.body);
  };

  const deleteGame = async (status: number = 200, id: number) => {
    const accessToken = await createAdminUser(app);
    return request(app.getHttpServer())
      .delete(`/games/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getGameBySlug = async (status: number = 200, slug: string) => {
    return request(app.getHttpServer())
      .get(`/games/${slug}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUsergames = async (accessToken: string, status: number = 200) => {
    return request(app.getHttpServer())
      .get('/games/user')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('adds a new game', async () => {
    const body = await addGame(app, 201, DEFAULT_GAME);
    expect(body.name).toEqual(DEFAULT_GAME.name);
  });

  it('updates an exsisting game', async () => {
    const game = await addGame(app, 201, {
      name: 'game5',
      description: 'desc5',
      metacritic: 500,
    });
    await updateGame(200, game.id, { name: 'new-gameName' });
    const updatedgame = await getGameBySlug(200, toSlug('new-gameName'));
    expect(updatedgame.game.name).toEqual('new-gameName');
  });

  it('returns error while updating with a wrong id', async () => {
    await updateGame(404, 230, { name: 'rubbish' });
  });

  it('delete an exsisting game', async () => {
    const game = await addGame(app, 201, DEFAULT_GAME);
    await deleteGame(200, game.id);
  });

  it('returns error while deleting a non-existing game', async () => {
    await deleteGame(404, 21);
  });

  it('finds all games', async () => {
    await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    await addGame(app, 201, {
      name: 'game2',
      description: 'desc2',
      metacritic: 200,
    });
    await addGame(app, 201, {
      name: 'game3',
      description: 'desc3',
      metacritic: 200,
    });
    const games = await request(app.getHttpServer())
      .get('/games')
      .expect(200)
      .then((res) => res.body);
    expect(games).toBeDefined();
  });


  it('finds game by slug', async () => {
    const game = await addGame(app, 201, {
      name: 'game4',
      description: 'desc4',
      metacritic: 200,
    });
    await getGameBySlug(200, game.slug);
  });

  it('returns an error if the game does not exist when finding by slug', async () => {
    await getGameBySlug(404, 'bullshit');
  });

  it('returns error if user is not admin when finding user games', async () => {
    const accessToken = 'dummyAccessTokenForTesting';
    await addGame(app, 201, DEFAULT_GAME);
    await getUsergames(accessToken, 401);
  });

  it('finds user games', async () => {
    const genre = await addGenre(app, 201, { name: 'new-genre' });
    const platform = await addPlatform(app, 201, { name: 'new-platform' });
    const publisher = await addPublisher(app, 201, { name: 'new-publisher' });
    const accessToken = await createAdminUser(app);
    await request(app.getHttpServer())
      .post('/games')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'user created game',
        description: 'stupid description so that you get off my shoulder',
        metacritic: 5,
        publisherIds: [publisher.id],
        genreIds: [genre.id],
        platformIds: [platform.id],
      })
      .expect(201)
      .then((res) => res.body);
    const games = await getUsergames(accessToken, 200);
    expect(games).toBeDefined();
    expect(games.items.length).toEqual(1);
  });
});
