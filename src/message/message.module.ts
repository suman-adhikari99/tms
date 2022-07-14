import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/order.repository';
import { TaskRepository } from 'src/task/task.repository';
import { TicketRepository } from 'src/ticket/ticket.repository';
import { GroupChannelRepository } from './group-channel.repository';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageGateway } from './message.gateway';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      MessageRepository,
      OrderRepository,
      GroupChannelRepository,
      TicketRepository,
      TaskRepository
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
})
export class MessageModule { }
