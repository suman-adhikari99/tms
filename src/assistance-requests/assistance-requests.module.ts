import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsRepository } from 'src/clients/clients.repository';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderRepository } from 'src/orders/order.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { UserRepository } from 'src/users/user.repository';
import { AssistanceRequestsController } from './assistance-requests.controller';
import { AssistanceRequestsRepository } from './assistance-requests.repository';
import { AssistanceRequestsService } from './assistance-requests.service';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([
      AssistanceRequestsRepository,
      OrderRepository,
      UserRepository,
      ClientsRepository,
      ProfileDataRepository,
    ]),
  ],
  controllers: [AssistanceRequestsController],
  providers: [AssistanceRequestsService],
  exports: [AssistanceRequestsService],
})
export class AssistanceRequestsModule {}
