import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { CreateBatchInvoiceDto } from './dto/create-batch-invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Financeiro (Faturas e Relatórios)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller() // Controller raiz (sem prefixo), pois as rotas usam prefixos customizados (/invoices, /reports)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // --- CRUD BÁSICO ---

  @Post('invoices')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria uma fatura individual para um aluno.' })
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({ status: 201, description: 'Fatura criada com sucesso.' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Patch('invoices/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza os dados de uma fatura.' })
  @ApiBody({ type: UpdateInvoiceDto })
  @ApiResponse({ status: 200, description: 'Fatura atualizada com sucesso.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Get('invoices')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'ADMIN: Lista todas as faturas com filtros e paginação.',
  })
  @ApiQuery({ type: FilterInvoiceDto })
  @ApiResponse({ status: 200, description: 'Lista de faturas retornada.' })
  findAll(@Query() filterDto: FilterInvoiceDto) {
    return this.invoicesService.findAll(filterDto);
  }

  @Get('invoices/:id')
  @ApiOperation({
    summary:
      'Busca uma fatura por ID. Acessível por Admin, Aluno e Responsável (se for a própria fatura).',
  })
  @ApiResponse({ status: 200, description: 'Fatura encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.invoicesService.findOne(id, req.user);
  }

  @Get('students/:studentId/invoices')
  @ApiOperation({
    summary:
      'Lista todas as faturas de um aluno. Acessível por Admin/Professor.',
  })
  @ApiResponse({ status: 200, description: 'Faturas do aluno listadas.' })
  findAllByStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req,
  ) {
    return this.invoicesService.findAllByStudent(studentId, req.user);
  }

  // --- AÇÕES ESPECÍFICAS E LOTE ---

  @Post('invoices/batch')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cria faturas em lote para todos os alunos de uma turma.',
  })
  @ApiBody({ type: CreateBatchInvoiceDto })
  @ApiResponse({
    status: 201,
    description: 'Faturas geradas em lote com sucesso.',
  })
  createBatch(@Body() dto: CreateBatchInvoiceDto) {
    return this.invoicesService.createBatch(dto);
  }

  @Post('invoices/:id/pay')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Marca uma fatura como PAGA e define a data de pagamento.',
  })
  @ApiResponse({ status: 200, description: 'Fatura marcada como paga.' })
  markAsPaid(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.markAsPaid(id);
  }

  @Post('invoices/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Marca uma fatura como CANCELADA.' })
  @ApiResponse({ status: 200, description: 'Fatura cancelada.' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.cancel(id);
  }

  // --- RELATÓRIOS ---

  @Get('reports/financial/revenue')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Relatório de Receita Total: Calcula o faturamento de faturas PAGAS em um período.',
  })
  @ApiQuery({ name: 'startDate', type: String, example: '2025-01-01' })
  @ApiQuery({ name: 'endDate', type: String, example: '2025-12-31' })
  @ApiResponse({ status: 200, description: 'Receita total calculada.' })
  getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.invoicesService.getRevenueReport(startDate, endDate);
  }

  @Get('reports/financial/defaults')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Relatório de Inadimplentes: Lista faturas VENCIDAS e PENDENTES.',
  })
  @ApiResponse({ status: 200, description: 'Lista de faturas inadimplentes.' })
  getDefaultsReport() {
    return this.invoicesService.getDefaultsReport();
  }
}
