// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Variáveis de ambiente disponíveis em toda a aplicação
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true, // Carrega todos os modelos automaticamente
      synchronize: true, // Cria/atualiza as tabelas no banco. Use apenas em desenvolvimento!
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}