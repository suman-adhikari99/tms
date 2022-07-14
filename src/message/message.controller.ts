import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { MessageService } from './message.service';
import { Request } from 'express';

@Controller('message')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/orderMessages')
  orderMessages(@CurrentUser() user: User, @Req() request: Request) {
    return this.messageService.userOrderMessage(user);
  }

  @Get('/ticketMessages')
  ticketMessages(@CurrentUser() user: User, @Req() request: Request) {
    return this.messageService.ticketMessages(user);
  }

  @Get('/taskMessages')
  taskMessages(@CurrentUser() user: User, @Req() request: Request) {
    return this.messageService.taskMessage(user);
  }

  @Get('/chatMessages')
  chatMessages(@CurrentUser() user: User, @Req() request: Request) {
    return this.messageService.chatMessage(user);
  }

}
