import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChannelRepository } from 'src/message/group-channel.repository';
import { MessageRepository } from 'src/message/message.repository';
import { TicketController } from './ticket.controller';
import { TicketRepository } from './ticket.repository';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketRepository,
      MessageRepository,
      GroupChannelRepository,
    ]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
