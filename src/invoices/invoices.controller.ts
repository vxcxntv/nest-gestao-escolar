import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { CreateBatchInvoiceDto } from './dto/create-batch-invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Financeiro - Faturas e Relatórios')
@ApiBearerAuth() // Indica que todos os endpoints neste controller exigem um token.
@UseGuards(AuthGuard('jwt'), RolesGuard) // Aplica os guards de autenticação e autorização globalmente.
@Controller() // Usamos um controller sem rota base para gerir rotas variadas como '/invoices' e '/reports'.
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('invoices')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Cria uma nova fatura para um aluno' })
  @ApiResponse({ status: 201, description: 'Fatura criada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Post('invoices/batch')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Cria faturas em lote para uma turma' })
  @ApiResponse({ status: 201, description: 'Faturas em lote criadas com sucesso.' })
  createBatch(@Body() createBatchDto: CreateBatchInvoiceDto) {
    return this.invoicesService.createBatch(createBatchDto);
  }

  @Get('invoices')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Lista todas as faturas com filtros e paginação' })
  findAll(@Query() filterDto: FilterInvoiceDto) {
    return this.invoicesService.findAll(filterDto);
  }

  @Get('students/:studentId/invoices')
  @ApiOperation({ summary: 'Lista todas as faturas de um aluno específico' })
  @ApiResponse({ status: 200, description: 'Lista de faturas do aluno.' })
  @ApiResponse({ status: 403, description: 'Acesso negado se o utilizador não for o próprio ou um admin.' })
  findAllByStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req,
  ) {
    return this.invoicesService.findAllByStudent(studentId, req.user);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Busca os detalhes de uma fatura por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.invoicesService.findOne(id, req.user);
  }

  @Patch('invoices/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Atualiza os dados de uma fatura' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Post('invoices/:id/pay')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Marca uma fatura como paga' })
  @HttpCode(HttpStatus.OK)
  markAsPaid(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.markAsPaid(id);
  }

  @Post('invoices/:id/cancel')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Cancela uma fatura' })
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.cancel(id);
  }

  @Get('reports/financial/revenue')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Gera um relatório de faturamento por período' })
  @ApiQuery({ name: 'startDate', required: true, example: '2025-01-01', description: 'Data de início (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, example: '2025-01-31', description: 'Data de fim (YYYY-MM-DD)' })
  getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.invoicesService.getRevenueReport(startDate, endDate);
  }

  @Get('reports/financial/defaults')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '(Admin) Gera um relatório de inadimplentes (faturas vencidas)' })
  getDefaultsReport() {
    return this.invoicesService.getDefaultsReport();
  }
}