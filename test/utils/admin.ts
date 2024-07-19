import { Role } from 'src/enums/database.enum';
import { getValidationDataAndRegister } from './login';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';

export const createAdminUser = async (
  app: NestFastifyApplication,
  status: number = 200,
  role: Role = Role.ADMIN,
) => {
  try {
    const { accessToken } = await getValidationDataAndRegister(app);
    await request(app.getHttpServer())
      .put('/user/role')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        role,
      })
      .expect(status)
      .then((res) => res.body);
    return accessToken;
  } catch (error) {
    console.log('error', error);
  }
};
