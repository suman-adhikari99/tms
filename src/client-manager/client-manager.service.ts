import { Injectable, NotFoundException } from '@nestjs/common';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { EmailRepository } from 'src/email/email.repository';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { OrderRepository } from 'src/orders/order.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { TaskRepository } from 'src/task/task.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId } from 'src/utilities';

@Injectable()
export class ClientManagerService {
  constructor(
    private s3UploaderService: S3UploaderService,
    private mailService: MailService,
    private emailRepository: EmailRepository,
    private orderRepository: OrderRepository,
    private taskRepository: TaskRepository,
    private projectManagement: ProjectManagement,
    private userRepository: UserRepository,
    private reviewOrderRepository: ReviewOrderRepository,
    private notificationsService: NotificationsService,
    private assistanceRequestsRepository: AssistanceRequestsRepository, // private mailService: MailService,
  ) {}

  async deliverOrder(oId: string, content) {
    try {
      console.log('oid >>', oId);
      console.log('content >>', content);
      const objectId = getObjectId(oId);
      const order = await this.orderRepository.findOne(objectId);

      const reviewOrder = await this.reviewOrderRepository.findOne({
        where: { orderId: oId },
      });
      if (!reviewOrder) {
        throw new NotFoundException('Order not found');
      }

      const invoice = reviewOrder.invoice;
      if (!invoice) {
        this.mailService.sendMail(content);
      } else {
        const fileName = invoice.file.fileName;
        const path = invoice.file.filePath;
        console.log('invoice >>', path);
        const decodeFile = path.split('.com/').pop();
        const filePath = decodeURIComponent(decodeFile);
        console.log('filePath >>', filePath);

        this.mailService.sendMailWithAttachment(content, fileName, filePath);
      }

      order.status.push(
        {
          mainStatus: 'Order Delivered',
          subStatus: 'Order Delivered',
          date: new Date().toISOString(),
          description: 'Your order has been Delivered',
        },
        {
          mainStatus: 'Payment Pending',
          subStatus: 'Payment Pending',
          date: new Date().toISOString(),
          description: 'Your Payment is pending',
        },
      );
      this.orderRepository.save(order);
      reviewOrder.status.push(
        {
          mainStatus: 'Order Delivered',
          subStatus: 'Order Delivered',
          date: new Date().toISOString(),
          description: 'Your order has been Delivered',
        },
        {
          mainStatus: 'Payment Pending',
          subStatus: 'Payment Pending',
          date: new Date().toISOString(),
          description: 'Your payment is pending',
        },
      );

      this.reviewOrderRepository.save(reviewOrder);
      this.notificationsService.orderDeliveryNotification(reviewOrder);
    } catch (error) {
      console.log('Error >>', error);
      throw new NotFoundException(error);
    }
  }

  // deliver request
  async deliverRequest(aId: string, body) {
    const objectId = getObjectId(aId);
    const assistanceRequest = await this.assistanceRequestsRepository.findOne(
      objectId,
    );
    console.log('assistanceRequest >>', assistanceRequest);

    assistanceRequest.status.push(
      {
        mainStatus: 'Request Delivered',
        subStatus: 'Request Delivered',
        date: new Date().toISOString(),
        description: 'Your request has been Delivered',
      },
      {
        mainStatus: 'Payment Pending',
        subStatus: 'Payment Pending',
        date: new Date().toISOString(),
        description: 'Your payment is pending',
      },
    );

    this.assistanceRequestsRepository.save(assistanceRequest);
    this.notificationsService.requestDeliveryNotification(assistanceRequest);
    this.mailService.sendMail(body);
  }

  // save profile
  async saveProfile(userId: string, projectId: string, user: User) {
    try {
      const objectId = getObjectId(userId);
      const currentUser = await this.userRepository.findOne(objectId);
      currentUser.savedBy.push({
        userId: user.id.toString(),
        projectId,
      });

      this.userRepository.save(currentUser);
    } catch (err) {}
  }

  // saved profile
  async getSavedProfile(projectId: string, user: User) {
    try {
      const savedProfile = await this.userRepository.find({
        where: {
          savedBy: { userId: user.id.toString(), projectId: projectId },
        },
      });
      return savedProfile;
    } catch (err) {
      console.log('err >>', err);
      throw new NotFoundException(err);
    }
  }

  // get recent task descending order
  async getRecentTask(user: User) {
    try {
      console.log('user >>', user);

      const project = await this.projectManagement.find({
        where: {
          'teamMember.userId': user.id.toString(),
        },
      });
      let recentTask = [];
      //get recently created task

      for (let i = 0; i < project.length; i++) {
        let tasks = await this.taskRepository.find({
          where: {
            projectId: project[i].id.toString(),
          },
          order: {
            createdAt: 'DESC',
          },
        });
        console.log('tasks >>', tasks.length);
        tasks.map((task) => {
          recentTask.push(task);
        });
      }
      console.log('recentTask >>', recentTask.length);
      return recentTask;
    } catch (err) {
      console.log('err >>', err);
      throw new NotFoundException(err);
    }
  }
}
// const task = await this.taskRepository
//   .aggregate([
//     {
//       $lookup: {
//         from: 'projects',
//         localField: 'projectId', // task
//         foreignField: '_id', //project
//         as: 'project',
//       },
//     },
//     {
//       $match: {
//         // projectId: { $},
//       },
// {
//   $match: {
//     $eq: {
//       'project.createdBy': user.id.toString(),
//     },
//   },
// },
// {
//   $group: {
//     _id: '$projectId',
//     tasks: {
//       $push: {
//         id: '$_id',
//         title: '$title',
//         description: '$description',
//         taskType: '$taskType',
//       },
//     },
//   },
//     },
//   ])
//   .toArray();
// console.log('task >>', task.length.toString());
// return task;
