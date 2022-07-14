import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/order.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ProjectReopenController } from './project-reopen.controller';
import { ProjectReopenRepository } from './project-reopen.repository';
import { ProjectReopenService } from './project-reopen.service';

@Module({
  imports: [
    // NotificationsModule,
    // UsersModule,
    TypeOrmModule.forFeature([
      ProjectManagement,
      // ProfileDataRepository,
      // UserRepository,
      OrderRepository,
      // TeamSummaryRepositry,
      // TaskRepository,
      ProjectReopenRepository,
    ]),
  ],
  controllers: [ProjectReopenController],
  providers: [ProjectReopenService],
})
export class ProjectReopenModule {}
