import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { TaskRepository } from 'src/task/task.repository';
import { UserRepository } from 'src/users/user.repository';
import { EditorController } from './editor.controller';
import { EditorService } from './editor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectManagement,
      UserRepository,
      TaskRepository,
    ]),
  ],
  controllers: [EditorController],
  providers: [EditorService],
})
export class EditorModule {}
