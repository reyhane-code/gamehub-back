import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { requestSender } from './utils/request-sender';
import {
  loginOrRegister,
  getValidationTokenAndCode,
  getValidationDataAndRegister,
} from './utils/login';
import * as request from 'supertest';
import { IUser } from '../src/users/interfaces/user.interface';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Context } from './utils/context';
import { TableName } from '../src/enums/database.enum';
import { ValidationPipe } from '@nestjs/common';

const DEFAULT_EMAIL = 'test@email.com';
const DEFAULT_PASSWORD = 'thispassisastring';
const FAKE_REFRESH_TOKEN =
  'eyJhbGciOiJ9.e3VDfmJegd60DC_DXUNaYwizqD3St_Li3pq-McfCVX7Y';
const DEFAULT_USERNAME = 'Myusername';
const DEFAULT_PHONE = '09363080321';

let context: Context;
beforeAll(async () => {
  console.log('before allllllllllllllllllllllllllllllllllllllllllllllll');
  context = await Context.build();
});

beforeEach(async () => {
  console.log('THISSSS');
  let users = await context.query('SELECT * FROM USERS');
  console.log('waiting', users);
  await context.clean(Object.values(TableName));
  users = await context.query('SELECT * FROM USERS');
  console.log(users, 'users', typeof users);
});
// afterAll(() => {
//   return context.close();
// });

describe('Authentication System (e2e)', () => {
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

  // const login = async (
  //   status: number = 200,
  //   email: string = DEFAULT_EMAIL,
  //   password: string = DEFAULT_PASSWORD,
  // ) => {
  //   return requestSender(app, status, '/auth/login', { email, password });
  //

  const loginWithPasswordAndPhone = async (
    status: number = 200,
    phone: string = DEFAULT_PHONE,
    password: string,
  ) => {
    await getValidationTokenAndCode(app);
    await setUserPassword(password);
    return requestSender(app, status, '/auth/login', { phone, password });
  };

  const loginWithPasswordAndUsername = async (
    status: number = 200,
    username: string = DEFAULT_USERNAME,
    password: string,
  ) => {
    await updateUserInfo();
    await setUserPassword(password);
    return requestSender(app, status, '/auth/login', {
      username,
      password,
    });
  };

  const loginWithPasswordAndEmail = async (
    status: number = 200,
    email: string = DEFAULT_EMAIL,
    password: string,
  ) => {
    await updateUserInfo();
    await setUserPassword(password);
    return requestSender(app, status, '/auth/login', { email, password });
  };

  const updateUserInfo = async (
    status: number = 200,
    email: string = DEFAULT_EMAIL,
    username: string = DEFAULT_USERNAME,
    phone: string = DEFAULT_PHONE,
    firstName?: string,
    lastName?: string,
  ): Promise<IUser> => {
    const { accessToken } = await getValidationDataAndRegister(app, phone);
    return request(app.getHttpServer())
      .put('/user')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        email,
        username,
        first_name: firstName,
        last_name: lastName,
      })
      .expect(status)
      .then((res) => res.body);
  };

  const setUserPassword = async (
    password: string = DEFAULT_PASSWORD,
    oldPassword?: string,
  ) => {
    const { accessToken } = await getValidationDataAndRegister(app);
    return request(app.getHttpServer())
      .put('/user/password')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword,
        password,
      })
      .then((res) => res.body);
  };
  const logout = async (status: number, accessToken: string) => {
    return request(app.getHttpServer())
      .delete('/auth/logout')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(status);
  };

  // it('registers with email and password', async () => {
  // });

  // register then logout then login => check login action
  it('checks the login action', async () => {
    const registerBody = await getValidationDataAndRegister(app);
    await logout(200, registerBody.accessToken);
    const loginBody = await getValidationDataAndRegister(app);

    expect(loginBody.accessToken).toBeDefined();
    expect(loginBody.refreshToken).toBeDefined();
  });

  it('returns an error if given credentials are not correct in a getValidationTokenAndCode req', async () => {
    await getValidationTokenAndCode(app, 400, '09fdsaf');
  });

  it('does not send a new sms if you already set a password in a getValidationTokenAndCode req', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    await setUserPassword();
    await logout(200, accessToken);
    const body = await getValidationTokenAndCode(
      app,
      201,
      DEFAULT_PHONE,
      false,
    );
    expect(body.hasPassword).toBeDefined();
    expect(body.hasPassword).toEqual(true);
    expect(body.code).toBeUndefined();
  });

  // CHECK : it should not return validationToken and code but it returns. why?
  // it('does not send a new sms if forceSendSms is false in a getValidationTokenAndCode req', async () => {
  //   const { accessToken } = await getValidationDataAndRegister();
  //   await logout(200, accessToken);
  //   const body = await getValidationTokenAndCode(200, DEFAULT_PHONE, false);
  //   console.log(body);
  //   expect(body.hasPassword).toBeDefined();
  //   expect(body.hasPassword).toEqual(false);
  // });

  it('logs in with email and password', async () => {
    const { refreshToken, accessToken } = await loginWithPasswordAndEmail(
      200,
      DEFAULT_EMAIL,
      DEFAULT_PASSWORD,
    );

    expect(refreshToken).toBeDefined();
    expect(accessToken).toBeDefined();
  });

  it('logs in with username and password', async () => {
    const { refreshToken, accessToken } = await loginWithPasswordAndUsername(
      200,
      DEFAULT_USERNAME,
      DEFAULT_PASSWORD,
    );

    expect(refreshToken).toBeDefined();
    expect(accessToken).toBeDefined();
  });

  it('logs in with phone and password', async () => {
    const { refreshToken, accessToken } = await loginWithPasswordAndPhone(
      200,
      DEFAULT_PHONE,
      DEFAULT_PASSWORD,
    );

    expect(refreshToken).toBeDefined();
    expect(accessToken).toBeDefined();
  });

  it('returns an error if the user is not registered', async () => {
    const { code, validationToken } = await getValidationTokenAndCode(app);
    await loginOrRegister(app, 400, validationToken + 'asdf', code);
    await loginOrRegister(app, 400, validationToken, code + '456');
  });

  it('checks if validation token is already used.', async () => {
    await getValidationDataAndRegister(app);
    setInterval(
      async () => {
        await getValidationTokenAndCode(app, 409);
      },
      60 * 2 * 1000,
    );
  });

  it('logs out using the access token set in the req header', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);
    await request(app.getHttpServer())
      .delete('/auth/logout')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('returns an error if the given access token is in the black list', async () => {
    const { accessToken } = await getValidationDataAndRegister(app);

    await logout(200, accessToken);

    await logout(403, accessToken);

    await request(app.getHttpServer())
      .get('/user')
      .set('authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('returns a new pair of access and refresh token', async () => {
    const { refreshToken } = await getValidationDataAndRegister(app);

    const tokens = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({ refreshToken: refreshToken })
      .expect(201);
    expect(tokens.body.accessToken).toBeDefined();
    expect(tokens.body.refreshToken).toBeDefined();
  });

  it('returns an error if the given refresh token is invalid', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({ refreshToken: FAKE_REFRESH_TOKEN })
      .expect(401);
  });

  it('updates the password of an existing user', async () => {
    await setUserPassword(DEFAULT_PASSWORD);
    const passwordChanged = await setUserPassword(
      DEFAULT_PASSWORD + 'somerubbish',
      DEFAULT_PASSWORD,
    );
    expect(passwordChanged).toBeDefined();
  });

  it('updates an existing user', async () => {
    const body = await updateUserInfo();
    console.log(body);
  });

  it('returns an error if the username/email is taken while updating a user ', async () => {
    await updateUserInfo(200, 'email@email.com', 'rabbishUserName');
    await updateUserInfo(200, 'email@email.com', 'rabbishUserName');
    await updateUserInfo(
      409,
      'email@email.com',
      'rabbishUserName',
      '09363080322',
    );
    await updateUserInfo(
      409,
      'rabbish@gmail.com',
      'rabbishUserName',
      '09363080322',
    );
  });
});
