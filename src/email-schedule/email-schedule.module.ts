import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { EmailRepository } from 'src/email/email.repository';
import { MailModule } from 'src/mail/mail.module';
import { OrderRepository } from 'src/orders/order.repository';
import { EmailSchedulingController } from './email-schedule.controller';
import { EmailSchedulingService } from './email-schedule.service';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([
      EmailRepository,
      OrderRepository,
      AssistanceRequestsRepository,
    ]),
  ],
  controllers: [EmailSchedulingController],
  providers: [EmailSchedulingService],
})
export class EmailSchedulingModule {}
