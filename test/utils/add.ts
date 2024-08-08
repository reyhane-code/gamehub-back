import { AddGenreDto } from 'src/genres/dtos/add-genre.dto';
import { createAdminUser } from './admin';
import * as request from 'supertest';
import { AddPlatformDto } from 'src/platforms/dtos/add-platform.dto';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AddPublisherDto } from 'src/publishers/dtos/add-publisher.dto';

export const addGenre = async (
  app: NestFastifyApplication,
  status: number = 201,
  { name }: AddGenreDto,
) => {
  const accessToken = await createAdminUser(app);
  return request(app.getHttpServer())
    .post('/genres')
    .set('authorization', `Bearer ${accessToken}`)
    .send({ name })
    .expect(status)
    .then((res) => res.body);
};

export const addPlatform = async (
  app: NestFastifyApplication,
  status: number = 201,
  { name }: AddPlatformDto,
) => {
  const accessToken = await createAdminUser(app);
  return request(app.getHttpServer())
    .post('/platforms')
    .set('authorization', `Bearer ${accessToken}`)
    .send({ name })
    .expect(status)
    .then((res) => res.body);
};

export const addPublisher = async (
  app: NestFastifyApplication,
  status: number = 201,
  { name }: AddPublisherDto,
) => {
  const accessToken = await createAdminUser(app);
  return request(app.getHttpServer())
    .post('/publishers')
    .set('authorization', `Bearer ${accessToken}`)
    .send({ name })
    .expect(status)
    .then((res) => res.body);
};

interface Game {
  name: string;
  description?: string;
  rating_top?: number;
  metacritic?: number;
}

export const addGame = async (
  app: NestFastifyApplication,
  status: number = 201,
  { name, description, metacritic }: Game,
) => {
  const genre = await addGenre(app, 201, { name: 'new-genre' });
  const platform = await addPlatform(app, 201, { name: 'new-platform' });
  const publisher = await addPublisher(app, 201, { name: 'new-publisher' });
  const accessToken = await createAdminUser(app);
  return request(app.getHttpServer())
    .post('/games')
    .set('authorization', `Bearer ${accessToken}`)
    .send({
      name,
      description,
      metacritic,
      publisherId: publisher.id,
      genreId: genre.id,
      platformId: platform.id,
    })
    .expect(status)
    .then((res) => res.body);
};
