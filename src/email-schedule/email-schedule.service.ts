import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { Email } from 'src/email/email.entity';
import { EmailRepository } from 'src/email/email.repository';
import { MailService } from 'src/mail/mail.service';
import { OrderRepository } from 'src/orders/order.repository';
import { User } from 'src/users/user.entity';
import { getString } from 'src/utilities';
import {
  AssistanceRequestsEmailScheduleDto,
  OrderDeliveryEmailScheduleDto,
  UpdateAssistanceRequestsEmailScheduleDto,
  UpdateOrderDeliveryEmailScheduleDto,
} from './dto/email-schedule.dto';

@Injectable()
export class EmailSchedulingService {
  constructor(
    private mailService: MailService,
    private emailRepository: EmailRepository,
    private orderRepository: OrderRepository,
    private assistanceRequestsRepository: AssistanceRequestsRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async orderDeliveryScheduleEmail(
    emailSchedule: OrderDeliveryEmailScheduleDto,
  ) {
    const email = {
      to: emailSchedule.to,
      from: emailSchedule.from,
      subject: emailSchedule.subject,
      content: emailSchedule.html,
      attachments: emailSchedule?.file || [],
      draft: true,
      scheduledDate: emailSchedule.scheduledDate,
      scheduledDeliveryCommonId: emailSchedule.orderId,
      createdDate: new Date().toISOString(),
    } as Email;

    const scheduledDate = new Date(emailSchedule.scheduledDate);
    const orderId = emailSchedule.orderId;

    if (scheduledDate <= new Date())
      throw new ConflictException(
        'Scheduled Date in past. Will never be fired.',
      );

    const order = await this.orderRepository.findOne(orderId);
    
    if (!order)
      throw new NotFoundException(`Order with Id ${orderId} not found.`);

    order.orderDeliveryScheduledDate = emailSchedule.scheduledDate;
    await this.orderRepository.save(order);

    const _email = this.emailRepository.create(email);
    const emailId = (await this.emailRepository.save(_email)).id;

    const job = new CronJob(scheduledDate, async () => {
      const _scheduledEmail = await this.emailRepository.findOne(
        getString(emailId),
      );
      const _order = await this.orderRepository.findOne(orderId);

      if (!_scheduledEmail)
        return {
          message: `No scheduled Email found`,
        };

      if (
        !_scheduledEmail.attachments ||
        _scheduledEmail.attachments.length < 1
      ) {
        this.mailService.sendMail({
          to: _scheduledEmail.to,
          from: _scheduledEmail.from,
          subject: _scheduledEmail.subject,
          html: _scheduledEmail.content,
        });
      } else {
        this.mailService.sendMailWithAttachment_2({
          to: _scheduledEmail.to,
          from: _scheduledEmail.from,
          subject: _scheduledEmail.subject,
          html: _scheduledEmail.content,
          file: _scheduledEmail.attachments,
        });
      }

      _scheduledEmail.draft = false;
      _scheduledEmail.scheduledDate = null;

      _order.orderDeliveryScheduledDate = null;

      await this.emailRepository.save(_scheduledEmail);
      await this.orderRepository.save(_order);

      return;
    });

    this.schedulerRegistry.addCronJob(
      `orderDelivery-${emailSchedule.orderId}`,
      job,
    );
    job.start();
  }

  async assistanceRequestsScheduleEmail(
    emailSchedule: AssistanceRequestsEmailScheduleDto,
  ) {
    const email = {
      to: emailSchedule.to,
      from: emailSchedule.from,
      subject: emailSchedule.subject,
      content: emailSchedule.html,
      attachments: emailSchedule?.file || [],
      draft: true,
      scheduledDate: emailSchedule.scheduledDate,
      scheduledDeliveryCommonId: emailSchedule.assistanceRequestId,
      createdDate: new Date().toISOString(),
    } as Email;

    const scheduledDate = new Date(emailSchedule.scheduledDate);
    const assistanceRequestId = emailSchedule.assistanceRequestId;

    if (scheduledDate <= new Date())
      throw new ConflictException(
        'Scheduled Date in past. Will never be fired.',
      );

      const assistanceRequest = await this.assistanceRequestsRepository.findOne(
        assistanceRequestId,
      );

      if (!assistanceRequest)
        throw new NotFoundException(
          `Assistance Request with Id ${assistanceRequestId} not found.`,
        );

      assistanceRequest.requestDeliveryScheduledDate =
        emailSchedule.scheduledDate;
      await this.assistanceRequestsRepository.save(assistanceRequest);

    const _email = this.emailRepository.create(email);
    const emailId = (await this.emailRepository.save(_email)).id;

    const job = new CronJob(scheduledDate, async () => {
      const _scheduledEmail = await this.emailRepository.findOne(
        getString(emailId),
      );
      const _assistanceRequest =
        await this.assistanceRequestsRepository.findOne(assistanceRequestId);

      if (!_scheduledEmail)
        return {
          message: `No scheduled Email found`,
        };

      if (
        !_scheduledEmail.attachments ||
        _scheduledEmail.attachments.length < 1
      ) {
        this.mailService.sendMail({
          to: _scheduledEmail.to,
          from: _scheduledEmail.from,
          subject: _scheduledEmail.subject,
          html: _scheduledEmail.content,
        });
      } else {
        this.mailService.sendMailWithAttachment_2({
          to: _scheduledEmail.to,
          from: _scheduledEmail.from,
          subject: _scheduledEmail.subject,
          html: _scheduledEmail.content,
          file: _scheduledEmail.attachments,
        });
      }

      _scheduledEmail.draft = false;
      _scheduledEmail.scheduledDate = null;

      _assistanceRequest.requestDeliveryScheduledDate = null;

      await this.emailRepository.save(_scheduledEmail);
      await this.assistanceRequestsRepository.save(_assistanceRequest);

      return;
    });

    this.schedulerRegistry.addCronJob(
      `assistanceRequestDelivery-${emailSchedule.assistanceRequestId}`,
      job,
    );
    job.start();
  }

  async orderDeliveryReScheduleEmail(
    emailReSchedule: UpdateOrderDeliveryEmailScheduleDto,
  ) {
    const orderId = emailReSchedule.orderId;
    const order = await this.orderRepository.findOne(orderId);

    if (!order)
      throw new NotFoundException(`Order with Id ${orderId} not found.`);

    const email = await this.emailRepository.findOne({
      where: {
        scheduledDeliveryCommonId: emailReSchedule.orderId,
      },
    });

    order.orderDeliveryScheduledDate = emailReSchedule.scheduledDate;
    this.orderRepository.save(order);

    email.scheduledDate = emailReSchedule.scheduledDate;
    this.emailRepository.save(email);

    const job = this.schedulerRegistry.getCronJob(
      `orderDelivery-${emailReSchedule.orderId}`,
    );
    job.setTime(new CronTime(new Date(emailReSchedule.scheduledDate)));
  }

  async assistanceRequestsReScheduleEmail(
    emailReSchedule: UpdateAssistanceRequestsEmailScheduleDto,
  ) {
    const assistanceRequestId = emailReSchedule.assistanceRequestId;
    const assistanceRequest = await this.assistanceRequestsRepository.findOne(
      assistanceRequestId,
    );

    if (!assistanceRequest)
      throw new NotFoundException(
        `Assistance Request with Id ${assistanceRequestId} not found.`,
      );

    const email = await this.emailRepository.findOne({
      where: {
        scheduledDeliveryCommonId: emailReSchedule.assistanceRequestId,
      },
    });

    assistanceRequest.requestDeliveryScheduledDate =
      emailReSchedule.scheduledDate;
    this.assistanceRequestsRepository.save(assistanceRequest);

    email.scheduledDate = emailReSchedule.scheduledDate;
    this.emailRepository.save(email);

    const job = this.schedulerRegistry.getCronJob(
      `orderDelivery-${emailReSchedule.assistanceRequestId}`,
    );
    job.setTime(new CronTime(new Date(emailReSchedule.scheduledDate)));
  }

  async orderDeliveryCancelScheduleEmail(
    emailSchedule: UpdateOrderDeliveryEmailScheduleDto,
  ) {
    const orderId = emailSchedule.orderId;
    const order = await this.orderRepository.findOne(orderId);

    if (!order)
      throw new NotFoundException(`Order with Id ${orderId} not found.`);

    order.orderDeliveryScheduledDate = null;
    this.orderRepository.save(order);

    const email = await this.emailRepository.findOne({
      where: {
        scheduledDeliveryCommonId: emailSchedule.orderId,
      },
    });
    this.emailRepository.delete(email.id);

    const job = this.schedulerRegistry.getCronJob(
      `orderDelivery-${emailSchedule.orderId}`,
    );
    job.stop();

    // this.schedulerRegistry.deleteCronJob(
    //   `orderDelivery-${emailSchedule.orderId}`
    // );

    return {
      message: `Order Delivery Scheduled mail for ${emailSchedule.scheduledDate} canceled`,
    };
  }

  async assistanceRequestsCancelScheduleEmail(
    emailSchedule: UpdateAssistanceRequestsEmailScheduleDto,
  ) {
    const assistanceRequestId = emailSchedule.assistanceRequestId;
    const assistanceRequest = await this.assistanceRequestsRepository.findOne(
      assistanceRequestId,
    );

    if (!assistanceRequest)
      throw new NotFoundException(
        `Assistance Request with Id ${assistanceRequestId} not found.`,
      );

    assistanceRequest.requestDeliveryScheduledDate = null;
    this.assistanceRequestsRepository.save(assistanceRequest);

    const email = await this.emailRepository.findOne({
      where: {
        scheduledDeliveryCommonId: emailSchedule.assistanceRequestId,
      },
    });
    this.emailRepository.delete(email.id);

    const job = this.schedulerRegistry.getCronJob(
      `assistanceRequestDelivery-${emailSchedule.assistanceRequestId}`,
    );
    job.stop();

    // this.schedulerRegistry.deleteCronJob(
    //   `assistanceRequestDelivery-${emailSchedule.assistanceRequestId}`
    // );

    return {
      message: `Assistance Request Delivery Scheduled mail for ${emailSchedule.scheduledDate} canceled`,
    };
  }

  async cancelAllScheduledEmails() {
    this.schedulerRegistry.getCronJobs().forEach((job) => {
      job.stop();
    });
  }

  async getAllScheduledMails() {
    console.log(this.schedulerRegistry.getCronJobs());
  }
}
