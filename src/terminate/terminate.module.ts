import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { ResignationRepository } from 'src/resignation-form/resignation.repository';
import { UserRepository } from 'src/users/user.repository';
import { TerminateController } from './terminate.controller';
import { TerminateRepository } from './terminate.repository';
import { TerminateService } from './terminate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TerminateRepository,
      EmployeeRepository,
      ResignationRepository,
      UserRepository,
    ]),
  ],
  providers: [TerminateService],
  controllers: [TerminateController],
})
export class TerminateModule {}
