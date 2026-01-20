import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // activation du CORS pour autoriser le client NextJS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
