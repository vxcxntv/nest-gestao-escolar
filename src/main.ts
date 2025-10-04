// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe()); 

  await app.listen(3000);
}
bootstrap();