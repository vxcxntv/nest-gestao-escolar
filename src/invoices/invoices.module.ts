import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from 'src/classes/models/class.model';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './models/invoice.model';

@Module({
  imports: [
    // Registra os modelos que este módulo utilizará.
    // O modelo 'Class' é necessário para a funcionalidade de criação de faturas em lote.
    SequelizeModule.forFeature([Invoice, Class]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}