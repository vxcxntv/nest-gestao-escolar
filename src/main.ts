// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validação global (usa os decorators do class-validator)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades não esperadas do DTO
    forbidNonWhitelisted: true, // lança erro se receber campo inválido
    transform: true, // converte tipos automaticamente (ex: string -> number)
  }));

  //app.useGlobalFilters(new HttpExceptionFilter());
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Gestão Escolar/Universitária API')
    .setDescription('Documentação completa para a API RESTful da plataforma de gestão, cobrindo módulos Acadêmicos, Financeiros e de Comunicação.')
    .setVersion('1.0')
    .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'access-token', // Nome de referência que usaremos para proteger as rotas
    )
    .addTag('Autenticação', 'Endpoints para login e gestão de tokens JWT')
    .addTag('Usuários', 'CRUD e gestão de perfis (Admin, Professor, Aluno, Responsável)')
    .addTag('Classes', 'Gestão de turmas, matrículas e associações')
    .addTag('Disciplinas', 'Gestão de matérias e currículo')
    .addTag('Notas (Grades)', 'Lançamento e consulta de notas')
    .addTag('Frequência', 'Registro e consulta de presenças/faltas')
    .addTag('Avisos', 'Comunicação oficial da escola/universidade')
    .addTag('Faturas', 'Gestão de mensalidades e pagamentos')
    .addTag('Relatórios Acadêmicos', 'Agregação de dados para histórico e desempenho')
    .addTag('Dashboards', 'Resumo de dados por perfil')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // A documentação ficará disponível em http://localhost:3000/api-docs
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Servidor rodando em http://localhost:3000`);
  console.log(`📘 Swagger disponível em http://localhost:3000/api-docs`);
}
bootstrap();
