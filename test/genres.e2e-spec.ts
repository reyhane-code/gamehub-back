import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getValidationDataAndRegister } from './utils/login';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Context } from './utils/context';
import { TableName } from 'src/enums/database.enum';
import { ValidationPipe } from '@nestjs/common';
import { MigrationPaths } from './utils/paths.enum';
import { AddGenreDto } from 'src/genres/dtos/add-genre.dto';
import { UpdateGenreDto } from 'src/genres/dtos/update-genre.dto';

const DEFAULT_GENRE = 'Action';

let context: Context;
// all tables names
const tables = Object.values(MigrationPaths);
beforeAll(async () => {
  context = await Context.build();
});

beforeEach(async () => {
  return context.clean(Object.values(TableName));
});

// afterAll(() => {
//   return context.close();
// });

describe('Genres System (e2e)', () => {
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

  const addGenre = async (status: number = 201, { name }: AddGenreDto) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .post('/genres')
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name })
      .expect(status)
      .then((res) => res.body);
  };

  const updateGenre = async (
    status: number = 200,
    id: number,
    { name }: UpdateGenreDto,
  ) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .put(`/genres/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name })
      .expect(status)
      .then((res) => res.body);
  };
  const deleteGenre = async (status: number, id: number) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .delete(`/genres/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getGenreById = async (status: number = 200, id: number) => {
    return request(app.getHttpServer())
      .get(`/genres/${id}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUsergenres = async (accessToken: string, status: number = 200) => {
    return request(app.getHttpServer())
      .get('/genres/user')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('adds a new genre', async () => {
    const body = await addGenre(201, { name: DEFAULT_GENRE });
    expect(body.name).toEqual(DEFAULT_GENRE);
  });

  it('updates an exsisting genre', async () => {
    const genre = await addGenre(201, { name: DEFAULT_GENRE });
    const body = await updateGenre(200, genre.id, { name: 'new-word' });
    expect(body.name).toEqual('new-word');
  });

  it('returns error while updating with a wrong id', async () => {
    await updateGenre(404, 2, { name: 'rubbish' });
  });

  it('delete an exsisting genre', async () => {
    const genre = await addGenre(201, { name: DEFAULT_GENRE });
    await deleteGenre(200, genre.id);
  });

  it('returns error while deleting a non-existing genre', async () => {
    await deleteGenre(404, 2);
  });

  it('finds all genres', async () => {
    await addGenre(201, { name: 'genre1' });
    await addGenre(201, { name: 'genre2' });
    await addGenre(201, { name: 'genre3' });
    const genres = await request(app.getHttpServer())
      .get('/genres')
      .expect(200)
      .then((res) => res.body);
    expect(genres.count).toEqual(3);
    expect(genres.data).toBeDefined();
  });

  it('returns error if there is no word when finding genres', async () => {
    return request(app.getHttpServer())
      .get('/genres')
      .expect(404)
      .then((res) => res.body);
  });

  it('finds genre by Id', async () => {
    const genre = await addGenre(201, { name: 'new-genre' });
    await getGenreById(200, genre.id);
  });

  it('returns an error if the genre does not exist when finding by id', async () => {
    await getGenreById(404, 23);
  });

  it('returns error if not the correct user when finding user genres', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    await addGenre(201, { name: 'word' });
    await getUsergenres(accessToken, 404);
  });

  it('finds user genres', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    await request(app.getHttpServer())
      .post('/genres')
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name: DEFAULT_GENRE })
      .expect(201)
      .then((res) => res.body);
    const genres = await getUsergenres(accessToken, 200);
    expect(genres.length).toEqual(1);
    expect(genres).toBeDefined();
  });
});
