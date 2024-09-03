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
import { AddArticleDto } from 'src/articles/dtos/add-article.dto';
import { UpdateArticleDto } from 'src/articles/dtos/update-article.dto';

const DEFAULT_ARTICLE = {
  title: 'article default',
  content: 'content of the default article is here',
};

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

describe('Articles System (e2e)', () => {
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

  const addArticle = async (
    status: number = 201,
    body: AddArticleDto = DEFAULT_ARTICLE,
    accessToken: String,
  ) => {
    return request(app.getHttpServer())
      .post(`/articles`)
      .set('authorization', `Bearer ${accessToken}`)
      .send(body)
      .expect(status)
      .then((res) => res.body);
  };

  const updateArticle = async (
    status: number = 200,
    id: number,
    body: UpdateArticleDto,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .put(`/articles/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send(body)
      .expect(status)
      .then((res) => res.body);
  };

  const deleteArticle = async (
    status: number = 200,
    id: number,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .delete(`/articles/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getArticle = async (status: number = 200, id: number) => {
    return request(app.getHttpServer())
      .get(`/articles/${id}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUserArticles = async (accessToken: string, status: number = 200) => {
    return request(app.getHttpServer())
      .get('/articles/user')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('adds a new article', async () => {
    const { accessToken } = await createAdminUser(app);
    const article = await addArticle(
      201,
      { title: 'newTitle', content: 'New article content' },
      accessToken,
    );
    expect(article.title).toEqual('newTitle');
  });

  it('updates an exsisting article', async () => {
    const { accessToken } = await createAdminUser(app);
    const article = await addArticle(
      201,
      { title: 'newTitle', content: 'New article content' },
      accessToken,
    );
    await updateArticle(
      200,
      article.id,
      { title: 'updating title of my article' },
      accessToken,
    );
    const updatedArticle = await getArticle(200, article.id);
    expect(updatedArticle.title).toEqual('updating title of my article');
  });

  it('returns error while updating with a wrong id', async () => {
    const { accessToken } = await createAdminUser(app);
    await updateArticle(404, 230, { title: 'rubbish' }, accessToken);
  });

  it('delete an exsisting article', async () => {
    const { accessToken } = await createAdminUser(app);
    const article = await addArticle(
      201,
      { title: 'newTitle', content: 'New article content' },
      accessToken,
    );
    await deleteArticle(200, article.id, accessToken);
  });

  it('returns error while deleting a non-existing article', async () => {
    const { accessToken } = await createAdminUser(app);
    await deleteArticle(404, 21, accessToken);
  });

  it('finds all articles with paginate', async () => {
    const { accessToken } = await createAdminUser(app);
    await addArticle(
      201,
      { title: 'newTitle', content: 'New article content' },
      accessToken,
    );
    await addArticle(
      201,
      { title: 'newTitle2', content: 'New article content2' },
      accessToken,
    );
    await addArticle(
      201,
      { title: 'newTitle3', content: 'New article content3' },
      accessToken,
    );
    const articles = await request(app.getHttpServer())
      .get('/articles/paginate')
      .expect(200)
      .then((res) => res.body);
    expect(articles.data).toBeDefined();
    expect(articles.count).toEqual(3);
  });

  it('returns error if there is no article when finding articles', async () => {
    return request(app.getHttpServer())
      .get('/articles')
      .expect(404)
      .then((res) => res.body);
  });

  it('finds article by id', async () => {
    const { accessToken } = await createAdminUser(app);
    const article = await addArticle(
      201,
      { title: 'newTitle5', content: 'New article content5' },
      accessToken,
    );
    await getArticle(200, article.id);
  });

  it('returns an error if the article does not exist when finding by id', async () => {
    await getArticle(404, 332);
  });

  it('returns error if user has not any articles when finding user articles', async () => {
    const { accessToken } = await createAdminUser(app);
    await getUserArticles(accessToken, 404);
  });

  it('finds user articles', async () => {
    const { accessToken } = await createAdminUser(app);

    await addArticle(
      201,
      { title: 'newTitle', content: 'New article content' },
      accessToken,
    );
    await addArticle(
      201,
      { title: 'newTitle2', content: 'New article content2' },
      accessToken,
    );
    await addArticle(
      201,
      { title: 'newTitle3', content: 'New article content3' },
      accessToken,
    );
    const articles = await getUserArticles(accessToken, 200);
    expect(articles.count).toEqual(3);
    expect(articles.data).toBeDefined();
  });
});
