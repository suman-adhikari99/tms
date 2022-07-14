import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './department.repository';
import { DepartmentService } from './department.service';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentRepository])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
