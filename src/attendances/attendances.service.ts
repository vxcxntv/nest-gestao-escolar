import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './models/attendance.model';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    private sequelize: Sequelize, // Injetamos o Sequelize para controlar a transação
  ) {}

  /**
   * Cria múltiplos registros de frequência em lote para uma aula.
   * Usa uma transação para garantir que todos os registros sejam criados ou nenhum seja.
   * @param createAttendanceDto Dados da aula e a lista de presença dos alunos.
   */
  async createBatch(createAttendanceDto: CreateAttendanceDto): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const { date, classId, subjectId, presences } = createAttendanceDto;

      // Mapeia o array de presenças para o formato esperado pelo `bulkCreate` do Sequelize
      const recordsToCreate = presences.map((presence) => ({
        date,
        classId,
        subjectId,
        studentId: presence.studentId,
        status: presence.status,
      }));

      // Cria todos os registros em uma única operação de banco de dados
      await this.attendanceModel.bulkCreate(recordsToCreate, {
        transaction,
      });

      // Se tudo deu certo, confirma a transação
      await transaction.commit();
    } catch (error) {
      // Se algum erro ocorreu, desfaz todas as operações
      await transaction.rollback();
      // Propaga o erro para o NestJS tratar
      throw error;
    }
  }
}
