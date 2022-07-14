import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { EmailRepository } from 'src/email/email.repository';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderRepository } from 'src/orders/order.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';
import { TaskRepository } from 'src/task/task.repository';
import { UserRepository } from 'src/users/user.repository';
import { ClientManagerController } from './client-manager.controller';
import { ClientManagerService } from './client-manager.service';

@Module({
  imports: [
    S3UploaderModule,
    MailModule,
    NotificationsModule,
    TypeOrmModule.forFeature([
      EmailRepository,
      OrderRepository,
      ReviewOrderRepository,
      AssistanceRequestsRepository,
      UserRepository,
      TaskRepository,
      ProjectManagement,
    ]),
  ],
  controllers: [ClientManagerController],
  providers: [ClientManagerService],
})
export class ClientManagerModule {}
