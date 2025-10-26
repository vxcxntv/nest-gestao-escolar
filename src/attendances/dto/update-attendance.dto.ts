import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { AttendanceStatus } from '../models/attendance.model';

export class UpdateAttendanceDto {
  @ApiProperty({
    description: 'Status da frequência',
    enum: AttendanceStatus,
    required: false,
    example: AttendanceStatus.PRESENT,
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiProperty({
    description: 'Data da frequência (YYYY-MM-DD)',
    required: false,
    example: '2024-01-15',
  })
  @IsDateString()
  @IsOptional()
  date?: string;
}
