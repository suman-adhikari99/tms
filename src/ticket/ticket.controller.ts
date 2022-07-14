import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketService } from './ticket.service';
import { User } from 'src/users/user.entity';

@Controller('ticket')
export class TicketController {
  constructor(private tickeService: TicketService) {}

  @Post('/create-new/')
  createTicket(
    @Body() ticketDto: CreateTicketDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.tickeService.createTicket(ticketDto, currentUser);
  }

  @Get('/all/')
  getTickets(@CurrentUser() currentUser: User) {
    return this.tickeService.getTickets(currentUser);
  }

  @Get('/ticket-number/:ticketNumber')
  getTicketByTicketNumber(
    @Param('ticketNumber') ticketNumber: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.tickeService.getTicketByTicketNumber(ticketNumber, currentUser);
  }
  
  @Get('/orderId/:id')
  getTicketByOrderId(
    @Param('id') orderId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.tickeService.getTicketByOrderId(orderId, currentUser);
  }

  @Put('/resolve/:id')
  resolveTicket(
    @Param('id') ticketId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.tickeService.resolveTicket(ticketId, currentUser);
  }
}
