import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { SearchOrderDto } from 'src/orders/dto/search-order.dto';
import { Order } from 'src/orders/order.entity';
import { User } from 'src/users/user.entity';
import { PlaceNotificationsDto } from './dto/place-notifications.dto';
import { Notifications } from './notifications.entity';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get('/my')
  getAllNotificationUser(@CurrentUser() user: User) {
    return this.notificationService.getAllNotifications(user);
  }

  @Get('/unseen')
  getUnseenNotification(@CurrentUser() user: User) {
    return this.notificationService.getUnseenNotification(user);
  }

  @Post('/seen')
  markRead(
    @Body() notificationDto: Notifications[],
    @CurrentUser() user: User,
  ) {
    return this.notificationService.markRead(notificationDto, user);
  }
}
