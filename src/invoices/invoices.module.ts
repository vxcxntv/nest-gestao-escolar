import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from 'src/classes/models/class.model';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './models/invoice.model';

@Module({
  imports: [SequelizeModule.forFeature([Invoice, Class])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
