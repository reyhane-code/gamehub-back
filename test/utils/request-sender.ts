import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const requestSender = async (
  app: NestFastifyApplication,
  status: number,
  route: string,
  data?: any,
) => {
  const response = await request(app.getHttpServer())
    .post(`${route}`)
    .send(data)
    .expect(status);

  return response.body;
};
