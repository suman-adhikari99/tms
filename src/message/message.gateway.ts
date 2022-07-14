import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Socket } from 'dgram';
import { Server } from 'http';
import { OrderMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseInterceptors(ClassSerializerInterceptor)
export class MessageGateway implements NestGateway {
  @WebSocketServer() server: Server;

  constructor(private messageService: MessageService) {}

  afterInit(server: any) {
    // console.log('Init', server);
  }

  async handleConnection(socket: any) {
    const query = socket.handshake.query;
    const channel = query['channel'];
    const user = query['user'];
    this.messageService.seenAllMessage(user, channel);
    this.sendMessage(channel);
  }

  async sendMessage(channel: string) {
    const messages = await this.messageService.getMessages(channel);
    messages.map((message) => {
      message['date'] = this.formatter(new Date(message['date']));
      message['type'] = message['role'];
    });
    this.server.emit(channel, messages);
  }

  formatter = (date: Date) => {
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return year + '/' + month + '/' + day;
  };

  handleDisconnect(socket: any) {
    const query = socket.handshake.query;
    console.log('Disconnect', socket.handshake.query);
  }

  @SubscribeMessage('orderMessage')
  async handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const newMessage = new OrderMessageDto();
    const channel = data['channel'];
    const userMessage = data['message'];
    newMessage.channel = channel;
    newMessage.date = new Date().toISOString();
    newMessage.message = userMessage;
    newMessage.name = data['name'];
    newMessage.creator = data['creator'];
    newMessage.seen = [data['user']];
    newMessage.user = data['user'];
    const currentUser = data['user'];
    newMessage.activeRole = data['activeRole'];
    newMessage.image = data['image'];
    // newMessage.fullName = data['fullName'];

    // orderMessage.files = {"name": data['fileName',url: data['url']]}

    await this.messageService.saveGroupChannel(
      channel,
      data['creator'],
      currentUser,
    );
    await this.messageService.saveChat(newMessage);
    this.sendMessage(channel);
  }
}
