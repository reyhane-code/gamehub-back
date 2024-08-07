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
import { UpdatePublisherDto } from 'src/publishers/dtos/update-publisher.dto';
import { createAdminUser } from './utils/admin';
import { addPublisher } from './utils/add';

const DEFAULT_PUBLISHER = 'ubsoft';

let context: Context;
beforeAll(async () => {
  context = await Context.getInstance();
});

beforeEach(async () => {
  return context.clean(Object.values(TableName));
});

describe('Publishers System (e2e)', () => {
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

  const updatePublisher = async (
    status: number = 200,
    id: number,
    { name }: UpdatePublisherDto,
  ) => {
    const accessToken = await createAdminUser(app);
    return request(app.getHttpServer())
      .put(`/publishers/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name })
      .expect(status)
      .then((res) => res.body);
  };
  const deletePublisher = async (status: number, id: number) => {
    const accessToken = await createAdminUser(app);
    return request(app.getHttpServer())
      .delete(`/publishers/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getPublisherById = async (status: number = 200, id: number) => {
    return request(app.getHttpServer())
      .get(`/publishers/${id}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUserPublishers = async (
    accessToken: string,
    status: number = 201,
  ) => {
    return request(app.getHttpServer())
      .get('/publishers/user')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('adds a new publisher', async () => {
    const body = await addPublisher(app, 201, { name: DEFAULT_PUBLISHER });
    expect(body.name).toEqual(DEFAULT_PUBLISHER);
  });

  it('updates an exsisting publisher', async () => {
    const publisher = await addPublisher(app, 201, { name: DEFAULT_PUBLISHER });
    await updatePublisher(200, publisher.id, { name: 'new-word' });
    const updatedPublisher = await getPublisherById(200, publisher.id);
    expect(updatedPublisher.name).toEqual('new-word');
  });

  it('returns error while updating with a wrong id', async () => {
    await updatePublisher(404, 20, { name: 'rubbish' });
  });

  it('delete an exsisting publisher', async () => {
    const publisher = await addPublisher(app, 201, { name: DEFAULT_PUBLISHER });
    await deletePublisher(200, publisher.id);
  });

  it('returns error while deleting a non-existing publisher', async () => {
    await deletePublisher(404, 20);
  });

  it('finds all publishers', async () => {
    await addPublisher(app, 201, { name: 'publisher1' });
    await addPublisher(app, 201, { name: 'publisher2' });
    await addPublisher(app, 201, { name: 'publisher3' });
    const publishers = await request(app.getHttpServer())
      .get('/publishers')
      .expect(200)
      .then((res) => res.body);
    expect(publishers).toBeDefined();
  });

  it('returns error if there is no word when finding publishers', async () => {
    return request(app.getHttpServer())
      .get('/publishers')
      .expect(404)
      .then((res) => res.body);
  });

  it('finds publisher by Id', async () => {
    const publisher = await addPublisher(app, 201, { name: 'new-publisher' });
    await getPublisherById(200, publisher.id);
  });

  it('returns an error if the publisher does not exist when finding by id', async () => {
    await getPublisherById(404, 23);
  });

  it('returns error if not the admin user when finding user publishers', async () => {
    const accessToken = 'dummyAccessTokenForTesting';
    await addPublisher(app, 201, { name: 'word' });
    await getUserPublishers(accessToken, 401);
  });

  it('finds user publishers', async () => {
    const accessToken = await createAdminUser(app);
    await request(app.getHttpServer())
      .post('/publishers')
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name: DEFAULT_PUBLISHER })
      .expect(201)
      .then((res) => res.body);
    const publishers = await getUserPublishers(accessToken, 200);
    expect(publishers.length).toEqual(1);
    expect(publishers).toBeDefined();
  });
});
