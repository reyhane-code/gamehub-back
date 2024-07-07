import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './custom-exceptions/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { contentParser } from 'fastify-multer';
import { join } from 'path';
const morgan = require('morgan');

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api/v1');
  app.use(morgan('tiny'));
  app.enableCors();
  await app.register(helmet);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      strategy: 'excludeAll',
      excludeExtraneousValues: true
    }
  }));
  app.register(contentParser);
  app.useStaticAssets({ root: join(__dirname, '../files') });

  const config = new DocumentBuilder()
    .setTitle('Leitner')
    .setDescription('The leitner API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000, '0.0.0.0');

  console.log(`Application listening on port ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
