import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import {
  AssistanceRequestsEmailScheduleDto,
  OrderDeliveryEmailScheduleDto,
  UpdateAssistanceRequestsEmailScheduleDto,
  UpdateOrderDeliveryEmailScheduleDto,
} from './dto/email-schedule.dto';
import { EmailSchedulingService } from './email-schedule.service';

@Controller('emailScheduling')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('/order-delivery/schedule')
  async orderDeliveryScheduleEmail(
    @Body() emailSchedule: OrderDeliveryEmailScheduleDto,
  ) {
    this.emailSchedulingService.orderDeliveryScheduleEmail(emailSchedule);
  }

  @Post('/assistance-requests/schedule')
  async assistanceRequestsScheduleEmail(
    @Body() emailSchedule: AssistanceRequestsEmailScheduleDto,
  ) {
    this.emailSchedulingService.assistanceRequestsScheduleEmail(emailSchedule);
  }

  @Post('/order-delivery/re-schedule')
  async orderDeliveryReScheduleEmail(
    @Body() emailReSchedule: UpdateOrderDeliveryEmailScheduleDto,
  ) {
    this.emailSchedulingService.orderDeliveryReScheduleEmail(emailReSchedule);
  }

  @Post('/assistance-requests/re-schedule')
  async assistanceRequestsReScheduleEmail(
    @Body() emailReSchedule: UpdateAssistanceRequestsEmailScheduleDto,
  ) {
    this.emailSchedulingService.assistanceRequestsReScheduleEmail(
      emailReSchedule,
    );
  }

  @Post('/order-delivery/cancel-schedule')
  async orderDeliveryCancelScheduleEmail(
    @Body() emailSchedule: UpdateOrderDeliveryEmailScheduleDto,
  ) {
    this.emailSchedulingService.orderDeliveryCancelScheduleEmail(emailSchedule);
  }

  @Post('/assistance-requests/cancel-schedule')
  async assistanceRequestsCancelScheduleEmail(
    @Body() emailSchedule: UpdateAssistanceRequestsEmailScheduleDto,
  ) {
    this.emailSchedulingService.assistanceRequestsCancelScheduleEmail(
      emailSchedule,
    );
  }
  
  @Get('/all')
  async getAllScheduledMails() {
    this.emailSchedulingService.getAllScheduledMails();
  }
}
