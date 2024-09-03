import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Context } from './utils/context';
import { CommentAbleEntity, TableName } from 'src/enums/database.enum';
import { ValidationPipe } from '@nestjs/common';
import { addGame } from './utils/add';
import { getValidationDataAndRegister } from './utils/login';
import { AddCommentDto } from 'src/comments/dtos/add-comment.dto';
import { UpdateCommentDto } from 'src/comments/dtos/update-comment.dto';

const DEFAULT_COMMENT = {
  content: 'the comment content',
  rete: 5,
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

describe('Comments System (e2e)', () => {
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

  const addComment = async (
    status: number = 201,
    entityType: CommentAbleEntity,
    entityId: number,
    body: AddCommentDto = DEFAULT_COMMENT,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .post(`/comments/${entityType}/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send(body)
      .expect(status)
      .then((res) => res.body);
  };

  const deleteComment = async (
    status: number = 200,
    entityId: number,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .delete(`/comments/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  const updateComment = async (
    status: number = 200,
    entityId: number,
    body: UpdateCommentDto,
    accessToken: string,
  ) => {
    return request(app.getHttpServer())
      .put(`/comments/${entityId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send(body)
      .expect(status)
      .then((res) => res.body);
  };

  const getComments = async (
    status: number = 200,
    entityType: CommentAbleEntity,
    entityId: number,
  ) => {
    return request(app.getHttpServer())
      .get(`/comments/${entityType}/${entityId}`)
      .expect(status)
      .then((res) => res.body);
  };

  const getUserComments = async (
    accessToken: string,
    status: number = 200,
    entityType: CommentAbleEntity,
  ) => {
    return request(app.getHttpServer())
      .get(`/comments/user/${entityType}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(status)
      .then((res) => res.body);
  };

  it('comments on a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    await addComment(
      201,
      CommentAbleEntity.GAME,
      game.id,
      DEFAULT_COMMENT,
      accessToken,
    );
  });

  it('deletes comment on a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);

    const comment = await addComment(
      201,
      CommentAbleEntity.GAME,
      game.id,
      DEFAULT_COMMENT,
      accessToken,
    );
    await deleteComment(200, comment.id, accessToken);
  });

  it('returns error while deleting a non-existing comment', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    await deleteComment(404, 200, accessToken);
  });

  it('finds all comments for a game', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);

    await addComment(
      201,
      CommentAbleEntity.GAME,
      game.id,
      {
        content: 'comment 1',
        rate: 3,
      },
      accessToken,
    );
    await addComment(
      201,
      CommentAbleEntity.GAME,
      game.id,
      {
        content: 'comment 2',
        rate: 3,
      },
      accessToken,
    );
    const comments = await getComments(200, CommentAbleEntity.GAME, game.id);
    expect(comments).toBeDefined();
  });

  it('finds user commentes', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    await addComment(
      201,
      CommentAbleEntity.GAME,
      game.id,
      { content: 'comment num1', rate: 1 },
      accessToken,
    );
    await addComment(
      201,
      CommentAbleEntity.GAME,
      game.id,
      { content: 'comment num2', rate: 2 },
      accessToken,
    );
    const comments = await getUserComments(
      accessToken,
      200,
      CommentAbleEntity.GAME,
    );
    expect(comments.items).toBeDefined();
    expect(comments.count).toEqual(2);
  });

  it('updates a comment', async () => {
    const game = await addGame(app, 201, {
      name: 'game1',
      description: 'desc1',
      metacritic: 200,
    });
    const { accessToken } = await getValidationDataAndRegister(app);
    const comment = await addComment(
      201,
      CommentAbleEntity.GAME,
      game.id,
      { content: 'comment num1', rate: 1 },
      accessToken,
    );
    await updateComment(
      200,
      comment.id,
      { content: 'update comment content' },
      accessToken,
    );
  });
});
