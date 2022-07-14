import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { channel } from 'diagnostics_channel';
import { create } from 'domain';
import mongoose from 'mongoose';
import { join } from 'path/posix';
import { NotFoundError } from 'rxjs';
import { OrderRepository } from 'src/orders/order.repository';
import { TaskRepository } from 'src/task/task.repository';
import { TicketRepository } from 'src/ticket/ticket.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId } from 'src/utilities';
import { OrderMessageDto } from './dto/create-message.dto';
import { GroupChannelDto } from './dto/group-channel.dto';
import { GroupChannelRepository } from './group-channel.repository';
import { Message } from './message.entity';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
    private orderRepository: OrderRepository,
    private groupChannelRepository: GroupChannelRepository,
    private ticketRepository: TicketRepository,
    private taskRepository: TaskRepository
  ) {}

  async getMessages(channel: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { channel },
    });
  }

  async saveChat(orderMessage: OrderMessageDto) {
    await this.messageRepository.save(orderMessage);
  }

  async saveGroupChannel(channel, creator, newMember) {
    const groupChannel = await this.groupChannelRepository.find({
      channel: channel,
    });
    //group not created already
    if (groupChannel.length == 0) {
      const newMembers = [newMember];
      if (creator != newMember) newMembers.push(creator);
      const newChannel = this.groupChannelRepository.create({
        ...GroupChannelDto,
        channel,
        groupmembers: newMembers,
      });
      this.groupChannelRepository.save(newChannel);
    } else {
      const groupMembers = groupChannel[0].groupmembers;
      if (!groupMembers.includes(newMember)) {
        groupMembers.push(newMember);
        await this.groupChannelRepository.save(groupChannel[0]);
      }
    }
  }
  async deleteAll() {
    await this.messageRepository.delete({});
  }

  async seenAllMessage(user: string, channel: string) {
    const unseenMessage = await this.messageRepository.find({
      where: { channel: channel, seen: { $ne: user } },
    });
    if (unseenMessage.length > 0) {
      for (let i = 0; i < unseenMessage.length; i++) {
        unseenMessage[i]['seen'].push(user);
        this.messageRepository.save(unseenMessage[i]);
      }
    }
  }

  async userOrderMessage(user: User) {
    //get all message in which user is involved in
    const involvedMessages = await this.groupChannelRepository.find({
      where: { groupmembers: { $in: [user.id.toString()] } },
    });

    const response = { unseen: 0, messages: [] };
    if (involvedMessages.length > 0) {
      for (let i = 0; i < involvedMessages.length; i++) {
        //check involvedMessages[i].channel valid mongo object id
        const channelId = mongoose.isValidObjectId(involvedMessages[i].channel) ? getObjectId(involvedMessages[i].channel) : involvedMessages[i].channel;

        const order = await this.orderRepository.find({
          where: { _id: channelId },
          select: ['journalTitle', 'orderDate', 'service'],
        });
        if (order.length > 0) {
          let orderMessage = order[0];
          let unseenMessage = await this.messageRepository.find({
            where: {
              channel: involvedMessages[i].channel,
              seen: { $ne: user.id.toString() },
            },
          });
          orderMessage['unseen'] = unseenMessage.length;
          response['unseen'] += unseenMessage.length;
          response.messages.push(orderMessage);
        }
      }
      return response;
    }
  }

  async taskMessage(user: User) {
    //get all message in which user is involved in
    const involvedMessages = await this.groupChannelRepository.find({
      where: { groupmembers: { $in: [user.id.toString()] } },
    });
    const response = { unseen: 0, messages: [] };
    if (involvedMessages.length > 0) {
      for (let i = 0; i < involvedMessages.length; i++) {
        const channelId = mongoose.isValidObjectId(involvedMessages[i].channel) ? getObjectId(involvedMessages[i].channel) : involvedMessages[i].channel;

        const task = await this.taskRepository.find({
          where: { _id: channelId },
          select: ['title'],
        });
        if (task.length > 0) {
          let taskMessage = task[0];
          let unseenMessage = await this.messageRepository.find({
            where: {
              channel: involvedMessages[i].channel,
              seen: { $ne: user.id.toString() },
            },
          });
          taskMessage['unseen'] = unseenMessage.length;
          response['unseen'] += unseenMessage.length;
          response.messages.push(taskMessage);
        }
      }
      return response;
    }
  }

  async chatMessage(user: User) {
    //get all message in which user is involved in
    const involvedMessages = await this.groupChannelRepository.find({
      where: { groupmembers: { $in: [user.id.toString()] } },
    });
    const response = { unseen: 0, messages: [] };
    if (involvedMessages.length > 0) {
      for (let i = 0; i < involvedMessages.length; i++) {
          let unseenMessage = await this.messageRepository.find({
            where: {
              channel: involvedMessages[i].channel,
              seen: { $ne: user.id.toString() },
            },
          });
          let taskMessage = {id: involvedMessages[i].channel,user: 'UNKNOWN'};
          taskMessage['unseen'] = unseenMessage.length;
          response['unseen'] += unseenMessage.length;
          response.messages.push(taskMessage);
      }
      return response;
    }
  }

  async ticketMessages(user: User) {
    //get all message in which user is involved in
    const involvedMessages = await this.groupChannelRepository.find({
      where: { groupmembers: { $in: [user.id.toString()] } },
    });
    const response = { unseen: 0, messages: [] };
    if (involvedMessages.length > 0) {
      for (let i = 0; i < involvedMessages.length; i++) {
        const channelId = mongoose.isValidObjectId(involvedMessages[i].channel) ? getObjectId(involvedMessages[i].channel) : involvedMessages[i].channel;

        const order = await this.ticketRepository.find({
          where: { _id: channelId },
          select: ['ticket'],
        });
        if (order.length > 0) {
          let ticketMesage = order[0];
          let unseenMessage = await this.messageRepository.find({
            where: {
              channel: involvedMessages[i].channel,
              seen: { $ne: user.id.toString() },
            },
          });
          ticketMesage['unseen'] = unseenMessage.length;
          response['unseen'] += unseenMessage.length;
          response.messages.push(ticketMesage);
        }
      }
      return response;
    }
  }
}
