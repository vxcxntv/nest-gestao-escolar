// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validação global (usa os decorators do class-validator)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades não esperadas do DTO
    forbidNonWhitelisted: true, // lança erro se receber campo inválido
    transform: true, // converte tipos automaticamente (ex: string -> number)
  }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestão Escolar')
    .setDescription('Documentação completa da API para a plataforma de gestão escolar.')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte a autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // A documentação ficará disponível em http://localhost:3000/api-docs
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Servidor rodando em http://localhost:3000`);
  console.log(`📘 Swagger disponível em http://localhost:3000/api-docs`);
}
bootstrap();
