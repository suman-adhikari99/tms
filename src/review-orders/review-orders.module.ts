import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsRepository } from 'src/clients/clients.repository';
import { NewFolderModule } from 'src/new-folder/new-folder.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderRepository } from 'src/orders/order.repository';
import { UserRepository } from 'src/users/user.repository';
import { ReviewOrdersController } from './review-orders.controller';
import { ReviewOrder } from './review-orders.entity';
import { ReviewOrdersService } from './review-orders.service';

@Module({
  imports: [
    NotificationsModule,
    NewFolderModule,
    TypeOrmModule.forFeature([
      ReviewOrder,
      OrderRepository,
      UserRepository,
      ClientsRepository,
    ]),
  ],
  controllers: [ReviewOrdersController],
  providers: [ReviewOrdersService],
  exports: [ReviewOrdersService],
})
export class ReviewOrdersModule {}
