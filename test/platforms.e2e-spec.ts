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
import { UpdatedPlatformDto } from 'src/platforms/dtos/update-platform.dto';
import { toSlug } from 'src/helpers/helpers';
import { createAdminUser } from './utils/admin';
import { addPlatform } from './add';

const DEFAULT_PLATFORM = 'PC';

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

describe('Platforms System (e2e)', () => {
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

  const updatePlatform = async (
    status: number = 200,
    id: number,
    { name }: UpdatedPlatformDto,
  ) => {
    const accessToken = await createAdminUser(app);
    return request(app.getHttpServer())
      .put(`/platforms/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name })
      .expect(status)
      .then((res) => res.body);
  };
  const deletePlatform = async (status: number, id: number) => {
    const accessToken = await createAdminUser(app);
    return request(app.getHttpServer())
      .delete(`/platforms/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getPlatformById = async (status: number = 200, id: number) => {
    return request(app.getHttpServer())
      .get(`/platforms/${id}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUserPlatforms = async (
    accessToken: string,
    status: number = 200,
  ) => {
    return request(app.getHttpServer())
      .get('/platforms/user')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('adds a new platform', async () => {
    const body = await addPlatform(app, 201, { name: DEFAULT_PLATFORM });
    expect(body.name).toEqual(DEFAULT_PLATFORM);
    expect(body.slug).toBeDefined();
    expect(body.slug).toEqual(toSlug(DEFAULT_PLATFORM));
  });

  it('updates an exsisting platform', async () => {
    const platform = await addPlatform(app, 201, { name: DEFAULT_PLATFORM });
    await updatePlatform(200, platform.id, {
      name: 'new-platform',
    });
    const updatedPlatform = await getPlatformById(200, platform.id);
    expect(updatedPlatform.name).toEqual('new-platform');
  });

  it('returns error while updating with a wrong id', async () => {
    await updatePlatform(404, 2, { name: 'rubbish' });
  });

  it('delete an exsisting platform', async () => {
    const platform = await addPlatform(app, 201, { name: DEFAULT_PLATFORM });
    await deletePlatform(200, platform.id);
  });

  it('returns error while deleting a non-existing platform', async () => {
    await deletePlatform(404, 20);
  });

  it('finds all platforms', async () => {
    await addPlatform(app, 201, { name: 'platform1' });
    await addPlatform(app, 201, { name: 'platform2' });
    await addPlatform(app, 201, { name: 'platform3' });
    const platforms = await request(app.getHttpServer())
      .get('/platforms')
      .expect(200)
      .then((res) => res.body);
    expect(platforms).toBeDefined();
  });

  it('returns error if there is no platform when finding platforms', async () => {
    return request(app.getHttpServer())
      .get('/platforms')
      .expect(404)
      .then((res) => res.body);
  });

  it('finds platform by Id', async () => {
    const platform = await addPlatform(app, 201, { name: 'new-platform' });
    await getPlatformById(200, platform.id);
  });

  it('returns an error if the platform does not exist when finding by id', async () => {
    await getPlatformById(404, 23);
  });

  it('returns error if not admin user when finding user platforms', async () => {
    const accessToken = 'dummyAccessTokenForTesting';
    await addPlatform(app, 201, { name: 'platform' });
    await getUserPlatforms(accessToken, 401);
  });

  it('finds user platforms', async () => {
    const accessToken = await createAdminUser(app);
    await request(app.getHttpServer())
      .post('/platforms')
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name: DEFAULT_PLATFORM })
      .expect(201)
      .then((res) => res.body);
    const platforms = await getUserPlatforms(accessToken, 200);
    expect(platforms.length).toEqual(1);
    expect(platforms).toBeDefined();
  });
});
