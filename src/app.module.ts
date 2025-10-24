import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles/roles.guard';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AuthModule } from './auth/auth.module';
import { AttendancesModule } from './attendances/attendances.module';
import { GradesModule } from './grades/grades.module';
import { ClassesModule } from './classes/classes.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { ReportsModule } from './reports/reports.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true, 
      synchronize: true, 
    }),
    UsersModule,
    SubjectsModule,
    ClassesModule,
    GradesModule,
    AttendancesModule,
    AuthModule,
    AnnouncementsModule,
    InvoicesModule,
    DashboardsModule,
    ReportsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}