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
import { AddPublisherDto } from 'src/publishers/dtos/add-publisher.dto';
import { UpdatePublisherDto } from 'src/publishers/dtos/update-publisher.dto';

const DEFAULT_PUBLISHER = 'ubsoft';

let context: Context;
// all tables names
const tables = Object.values(MigrationPaths);
beforeAll(async () => {
  context = await Context.build(tables);
});

beforeEach(async () => {
  return context.clean(Object.values(TableName));
});

afterAll(() => {
  return context.close();
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

  const addWord = async (status: number = 201, { name }: AddPublisherDto) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .post('/publishers')
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name })
      .expect(status)
      .then((res) => res.body);
  };

  const updatePublisher = async (
    status: number = 200,
    id: number,
    { name }: UpdatePublisherDto,
  ) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .put(`/publishers/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({ name })
      .expect(status)
      .then((res) => res.body);
  };
  const deletePublisher = async (status: number, id: number) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .delete(`/publishers/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getPublisherById = async (status: number = 200, wordId: number) => {
    return request(app.getHttpServer())
      .get(`/word/${wordId}`)
      .expect(status)
      .then((res) => res.body);
  };

  //   it('adds a new word', async () => {
  //     const body = await addWord(201, DEFAULT_WORD);
  //     expect(body.word).toEqual(DEFAULT_WORD);
  //   });

  //   it('returns a conflict error if the word already exists and is confirmed', async () => {
  //     await addWord(201, DEFAULT_WORD);
  //     await addWord(409, DEFAULT_WORD);
  //     await addWord(201, 'new-word');
  //   });

  //   it('updates an exsisting word', async () => {
  //     const word = await addWord(201, DEFAULT_WORD);
  //     const body = await updateWord(200, word.id, 'new-word');
  //     expect(body.word).toEqual('new-word');
  //   });

  //   it('returns error while updating with a wrong id', async () => {
  //     await updateWord(404, 2, 'worddd');
  //   });

  //   it('delete an exsisting word', async () => {
  //     const word = await addWord(201, DEFAULT_WORD);
  //     await deleteWord(200, word.id);
  //   });

  //   it('returns error while deleting a non-existing word', async () => {
  //     await deleteWord(404, 2);
  //   });

  //   it('assigns word to a user', async () => {
  //     const word = await addWord(201, 'word');
  //     await assignWord(201, word.id);
  //   });

  //   it('returns error when assigning a non-existing word', async () => {
  //     await assignWord(404, 2);
  //   });

  //   it('finds all words', async () => {
  //     await addWord(201, 'word1');
  //     await addWord(201, 'word2');
  //     await addWord(201, 'word3');
  //     return request(app.getHttpServer())
  //       .get('/word')
  //       .expect(200)
  //       .then((res) => res.body);
  //   });

  //   // it('returns error if there is no word when finding words', async () => {
  //   //   return request(app.getHttpServer())
  //   //     .get('/word')
  //   //     .expect(404)
  //   //     .then((res) => res.body);
  //   // });

  //   it('finds assigned words', async () => {
  //     const word = await addWord(201, 'word');
  //     await assignWord(201, word.id);
  //     await getAssignedWords(200);
  //   });

  //   // it('returns error if there are no words when finding assigned words', async () => {
  //   //   await getAssignedWords(404);
  //   // });

  //   it('finds word by Id', async () => {
  //     const word = await addWord(201, 'newWord');
  //     await getWordById(200, word.id);
  //   });

  //   it('returns an error if the word does not exist when finding by id', async () => {
  //     await getWordById(404, 23);
  //   });

  //   it('finds user words', async () => {
  //     const { accessToken } = await getValidationDataAndRegister(app);
  //     await addWord(201, 'word');

  //     return request(app.getHttpServer())
  //       .get('/word/user/1')
  //       .set('authorization', `Bearer ${accessToken}`)
  //       .expect(200)
  //       .then((res) => res.body);
  //   });
  //   //TODO : fix this
  //   // it('reutrns error if user is wrong when finding user words', async () => {
  //   //   const { accessToken } = await getValidationDataAndRegister(app);
  //   //   return request(app.getHttpServer())
  //   //     .get('/word/user/22')
  //   //     .set('authorization', `Bearer ${accessToken}`)
  //   //     .expect(404)
  //   //     .then((res) => res.body);
  //   // });
});
