import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { UserRepository } from 'src/users/user.repository';
@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([OrderRepository, UserRepository]),
  ],
  providers: [OrdersService, GuestService],
  controllers: [OrdersController, GuestController],
  exports: [OrdersService],
})
export class OrdersModule {}
