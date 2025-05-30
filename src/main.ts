import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  app.enableCors({
    allowedHeaders: '*',
    origin: "*",
    credentials: true,
  });
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  await app.listen(3300);//
}
bootstrap();
