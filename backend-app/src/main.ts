import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });

  app.enableCors({
    allowedHeaders: 'Content-Type',
    origin: 'http://localhost:4200',
    credentials: true,
  });
  await app.listen(AppModule.port);
}
bootstrap();
