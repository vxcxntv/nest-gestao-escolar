import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/models/user.model';
import { DashboardsService } from './dashboards.service';
import { 
  AdminDashboardResponse, 
  TeacherDashboardResponse, 
  StudentDashboardResponse 
} from './dto/dashboard-response.dto';

@ApiTags('Dashboards')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obter dashboard administrativo' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard administrativo retornado com sucesso',
    type: AdminDashboardResponse
  })
  getAdminDashboard(@Request() req) {
    return this.dashboardsService.getAdminDashboard();
  }

  @Get('teacher')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Obter dashboard do professor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard do professor retornado com sucesso',
    type: TeacherDashboardResponse
  })
  getTeacherDashboard(@Request() req) {
    return this.dashboardsService.getTeacherDashboard(req.user.userId);
  }

  @Get('student')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Obter dashboard do aluno' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard do aluno retornado com sucesso',
    type: StudentDashboardResponse
  })
  getStudentDashboard(@Request() req) {
    return this.dashboardsService.getStudentDashboard(req.user.userId);
  }
}
