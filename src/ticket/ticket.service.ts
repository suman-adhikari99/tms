import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChannelRepository } from 'src/message/group-channel.repository';
import { MessageRepository } from 'src/message/message.repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketRepository } from './ticket.repository';
import { User } from 'src/users/user.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketRepository)
    private ticketRepository: TicketRepository,
    private messageRepository: MessageRepository,
    private groupRepository: GroupChannelRepository,
  ) {}
  // create new Ticket
  async createTicket(ticketDto: CreateTicketDto, currentUser: User) {
    if (!(currentUser.role.activeRole === 'BM'))
      throw new ForbiddenException('Only Billing manager can create tickets');

    const ticket = await this.ticketRepository.create({
      createdDate: new Date().toISOString(),
      status: 'Pending',
      orderId: ticketDto.orderId,
      cmId: ticketDto.cmId,
      bmId: ticketDto.bmId,
      message: ticketDto.message,
      ticket: Math.floor(Math.random() * 100000000).toString(),
    });

    await this.ticketRepository.save(ticket);

    // make object of Message
    const messageObj = await this.messageRepository.create({
      orderId: ticketDto.orderId, // added
      message: ticketDto.message,
      seen: [ticketDto.bmId],
      creator: ticketDto.bmId,
      channel: ticket.id.toString(),
      activeRole: currentUser.role.activeRole,
      date: new Date().toISOString(),
      name: ticketDto.name,
      image: ticketDto.image,
    });
    await this.messageRepository.save(messageObj);

    // create group channel
    const ticketGroup = await this.groupRepository.create({
      channel: ticket.id.toString(),
      groupmembers: [ticketDto.bmId, ticketDto.cmId],
    });
    await this.groupRepository.save(ticketGroup);
  }

  async getTickets(currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'BM' ||
        currentUser.role.activeRole === 'CM'
      )
    )
      throw new ForbiddenException(
        'Only Billing manager and Client manager can access',
      );

    return this.ticketRepository.find();
  }

  async getTicketByTicketNumber(ticketNumber: string, currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'BM' ||
        currentUser.role.activeRole === 'CM'
      )
    )
      throw new ForbiddenException(
        'Only Billing manager and Client manager can access',
      );

    let ticket = await this.ticketRepository.findOne({
      where: {
        ticket: ticketNumber,
      },
    });

    if (!ticket)
      throw new NotFoundException(
        `No ticket with ticket number ${ticketNumber}`,
      );

    return ticket;
  }

  async getTicketByOrderId(orderId: string, currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'BM' ||
        currentUser.role.activeRole === 'CM'
      )
    )
      throw new ForbiddenException(
        'Only Billing manager and Client manager can access',
      );

    let ticket = await this.ticketRepository.findOne({
      where: {
        orderId: orderId,
      },
    });

    if (!ticket)
      throw new NotFoundException(`No ticket for order Id ${orderId}`);

    return ticket;
  }

  async resolveTicket(ticketId: string, currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'BM' ||
        currentUser.role.activeRole === 'CM'
      )
    )
      throw new ForbiddenException('Only Billing manager can access');

    let ticket = await this.ticketRepository.findOne(ticketId);

    if (!ticket)
      throw new NotFoundException(`No ticket with ticket id ${ticketId}`);

    ticket.status = 'Resolved';
    return this.ticketRepository.save(ticket);
  }
}
