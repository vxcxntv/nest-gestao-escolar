import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  /**
   * Endpoint para um professor registrar a frequência de uma aula em lote.
   */
  @Roles(UserRole.TEACHER)
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content em caso de sucesso
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.createBatch(createAttendanceDto);
  }
}
