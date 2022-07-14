import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/order.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { Project } from 'src/projects/project.entity';
import { Task } from 'src/task/task.entity';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId, getString } from 'src/utilities';
import { Notifications, NotificationType } from './notifications.entity';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsRepository)
    private notificationsRepository: NotificationsRepository,
    private userRepository: UserRepository,
    private reviewOrderRepository: ReviewOrderRepository,
    private orderRepository: OrderRepository,
    private projectRepository: ProjectManagement,
  ) {}

  async invitationFromCMToEditor(task: Task, editorUser: User, user: User) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(user.id),
      userId: getString(editorUser.id),
      commonId: getString(id),
      notificationType: NotificationType.TaskInvitation,
      notificationTitle: `Task: ${title}`,
      notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
      hasRead: false,
      status: [
        {
          description:
            'Invitation from CM to Editor to participate in this task.',
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].mainStatus,
          subStatus: status.slice(-1)[0].mainStatus,
        },
      ],
      // taskId: task.id.toString(),
      role: user.role.activeRole,
      // url: 'Task',
    });
    return this.notificationsRepository.save(newN);
  }

  async getAllNotifications(user: User) {
    let pipeline = [
      {
        $match: {
          userId: getString(user.id),
          fromId: {
            $ne: '',
          },
        },
      },
      {
        $group: {
          _id: '$fromId',
          notification: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userObjectId: {
              $toObjectId: '$_id',
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userObjectId'],
                },
              },
            },
            {
              $project: {
                _id: {
                  $toString: '$_id',
                },
                'role.activeRole': 1,
                fullName: 1,
                image: 1,
              },
            },
          ],
          as: 'fromUser',
        },
      },
      {
        $unwind: {
          path: '$notification',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$fromUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'notification.status': {
            $last: '$notification.status',
          },
          'notification.fromUser': '$fromUser',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$notification',
        },
      },
      {
        $addFields: {
          id: {
            $toString: '$_id',
          },
        },
      },
      {
        $project: {
          fromId: 0,
          _id: 0,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ];

    const notifications = await this.notificationsRepository
      .aggregate(pipeline)
      .toArray();

    if (!notifications || notifications.length < 1) return [];

    return notifications;
  }

  async sendNewOrderNotification(newOrder) {
    const { id: orderId, userId, journalTitle } = newOrder;

    // we can order without being user, as guest user
    // if (!userId)
    //   throw new BadRequestException(`UserId not found in new order ${orderId}`);

    const manager = await this.userRepository.find({
      where: { 'role.activeRole': 'CM' },
    });

    if (manager && manager.length > 0) {
      for (let i = 0; i < manager.length; i++) {
        const newN = this.notificationsRepository.create({
          date: new Date().toISOString(),
          fromId: getString(userId),
          userId: getString(manager[i].id),
          commonId: getString(orderId),
          notificationType: NotificationType.NewOrder,
          notificationTitle: `Order: ${journalTitle}`,
          notificationTypeRelatedId: getString(orderId),
          hasRead: false,
          status: [
            {
              date: new Date().toISOString(),
              mainStatus: 'Confirming Order',
              subStatus: 'Confirming Order',
              description: 'New Order Placed',
            },
          ],
          // orderId: id.toString(),
          // orderTitle: journalTitle,
          // url: 'Order',
        });
        await this.notificationsRepository.save(newN);
      }
    }
    return 'Notification sent';
  }

  async sendNewQuotationNotification(reviewOrder) {
    const { orderId, journalTitle, reviewedBy, userId } = reviewOrder;

    const acceptedOrder = await this.reviewOrderRepository.find({
      where: { quotationStatus: { $ne: 'new' } },
      // sort ascending by date
    });

    if (!acceptedOrder || acceptedOrder.length < 1)
      return 'No reviewed order found';

    const billingManagers = await this.userRepository.find({
      where: {
        where: { 'role.mainRoles': { $in: ['BM'] } },
      },
    });

    let notificationReceiverIds = [];

    notificationReceiverIds = billingManagers.map((billingManager) =>
      getString(billingManager.id),
    );
    notificationReceiverIds.push(getString(userId));

    // const objectId = getObjectId(reviewedBy);
    // const manager = await this.userRepository.findOne(objectId);

    for (let notificationReceiverId of notificationReceiverIds) {
      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        fromId: reviewedBy.toString(),
        // userId: getString(reviewOrder.billingManagerId),
        userId: getString(notificationReceiverId),
        commonId: orderId,
        notificationType: NotificationType.OrderReview,
        notificationTitle: `Order: ${journalTitle}`,
        notificationTypeRelatedId: getString(orderId),
        hasRead: false,
        status: [
          {
            mainStatus: reviewOrder.status.mainStatus,
            subStatus: reviewOrder.status.subStatus,
            date: new Date().toISOString(),
            description: `Quotation reviewed by ${reviewedBy}.`,
          },
        ],
        // orderId,
        // orderTitle: journalTitle,
        // url: 'Order',
      });
      await this.notificationsRepository.save(newN);
    }
    return 'Notifications sent';
  }

  async invitationNotificationForTeamMembers(notice, user: User) {
    for (let i = 0; i < notice.teamMember.length; i++) {
      let teamMember = notice.teamMember[i];

      if (teamMember.userId === getString(user.id)) continue;

      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        fromId: getString(notice.createdBy),
        userId: getString(teamMember.userId), //  created by
        commonId: getString(notice.id), // could be project id or assistance request id
        notificationType: notice.projectId
          ? NotificationType.TaskInvitation
          : NotificationType.ProjectInvitation,
        notificationTitle: `Invitation for participation (${
          notice.assistantType ? 'Assistance Request Notice' : 'Project Notice'
        })`,
        notificationTypeRelatedId: getString(notice.id),
        hasRead: false,
        status: [
          {
            description: 'Invitation to participate in this notice.',
            date: new Date().toISOString(),
            mainStatus: notice.status.slice(-1)[0].mainStatus
              ? notice.status.slice(-1)[0].mainStatus
              : notice.status.slice(-1)[0].status,
            subStatus: notice.status.slice(-1)[0].mainStatus
              ? notice.status.slice(-1)[0].mailService
              : notice.status.slice(-1)[0].status,
          },
        ],
        // orderTitle: notice.title,
        role: user.role.activeRole,
        // url: notice.projectId ? 'Task' : 'Project',
        // notificationFrom: notice.assistantType
        //   ? 'Assistance Request'
        //   : 'Project',
        // projectId: project.id,
      });
      await this.notificationsRepository.save(newN);
    }
    return 'Notification sent';
  }

  async invitationNotificationForTeamMembersTask(notice, user: User) {
    for (let i = 0; i < notice.teamMember.length; i++) {
      let teamMember = notice.teamMember[i];

      if (teamMember.userId === getString(user.id)) continue;

      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        fromId: getString(notice.createdBy),
        userId: getString(notice.teamMember[i].userId),
        commonId: getString(notice.projectId),
        notificationType: NotificationType.TaskInvitation,
        notificationTitle: 'Invitation for task participation',
        notificationTypeRelatedId: getString(notice.id),
        hasRead: false,
        status: [
          {
            description: 'Invitation to participate in this notice.',
            date: new Date().toISOString(),
            mainStatus: notice.status.slice(-1)[0].mainStatus
              ? notice.status.slice(-1)[0].mainStatus
              : notice.status.slice(-1)[0].status,
            subStatus: notice.status.slice(-1)[0].mainStatus
              ? notice.status.slice(-1)[0].mailService
              : notice.status.slice(-1)[0].status,
          },
        ],
        // orderTitle: notice.title,
        role: user.role.activeRole,
        // url: 'Task',
        // notificationFrom: 'Task Type',
        // projectId: project.id,
      });
      this.notificationsRepository.save(newN);
    }
    return 'Notification sent';
  }

  async invitationNotificationForEditor(newtask: Task, user: User) {
    const { id, title, status } = newtask;

    const taskRelatedProjectObjectId = newtask.projectId;

    for (let i = 0; i < newtask.teamMember.length; i++) {
      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        fromId: getString(user.id),
        userId: getString(newtask.teamMember[i].userId),
        commonId: getString(id),
        notificationType: NotificationType.TaskInvitation,
        notificationTitle: `Task: ${title}`,
        notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
        hasRead: false,
        status: [
          {
            date: new Date().toISOString(),
            mainStatus: status.slice(-1)[0].mainStatus,
            subStatus: status.slice(-1)[0].mainStatus,
            description: 'Invitation for editor to participate in this task.',
          },
        ],
        role: user.role.activeRole,
        // orderTitle: newtask.title,
        // taskId: newtask.id,
        // url: 'Task',
      });
      this.notificationsRepository.save(newN);
    }
    return 'Notification sent';
  }

  async acceptedByChiefEditor(project: Project, user: User) {
    const { id, title, status } = project;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(user.id),
      userId: getString(project.createdBy),
      commonId: getString(id),
      notificationType: NotificationType.ProjectInvitationAcceptance,
      notificationTitle: `Project: ${title}`,
      notificationTypeRelatedId: getString(id),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].status,
          subStatus: status.slice(-1)[0].status,
          description:
            'Chief editor accepted your invitation to participate in this project.',
        },
      ],
      // orderTitle: project.title,
      role: user.role.activeRole,
      // projectId: project.id,
      // url: 'Project',
    });
    return this.notificationsRepository.save(newN);
  }

  async rejectedByChiefEditor(project: Project, user: User) {
    const { id, title, status } = project;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(user.id),
      userId: getString(project.createdBy),
      commonId: getString(id),
      notificationType: NotificationType.ProjectInvitationRejection,
      notificationTitle: `Project: ${title}`,
      notificationTypeRelatedId: getString(id),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].status,
          subStatus: status.slice(-1)[0].status,
          description: 'Project Rejected by Chief Editor ',
        },
      ],
      // orderTitle: project.title,
      role: user.role.activeRole,
      // projectId: project.id,
      // url: 'Project',
    });
    return this.notificationsRepository.save(newN);
  }

  async taskRejectByEditor(task: Task, user: User) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(user.id),
      userId: getString(task.userId),
      commonId: getString(id),
      notificationType: NotificationType.TaskInvitationRejection,
      notificationTitle: `Task: ${title}`,
      notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].mainStatus,
          subStatus: status.slice(-1)[0].mainStatus,
          description: 'Project Task Rejected by Editor',
        },
      ],
      // orderTitle: task.title,
      role: user.role.activeRole,
      // taskId: task.id,
      // url: 'Task',
    });
    return this.notificationsRepository.save(newN);
  }

  async notificationRequestToParticipate(project: Project, user: User) {
    const { id, title, status } = project;

    for (let i = 0; i < project.teamMember.length; i++) {
      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        fromId: user.id,
        userId: project.teamMember[i].userId,
        commonId: getString(id),
        notificationType: NotificationType.ProjectInvitation,
        notificationTitle: `Project: ${title}`,
        notificationTypeRelatedId: getString(id),
        hasRead: false,
        status: [
          {
            date: new Date().toISOString(),
            mainStatus: status.slice(-1)[0].status,
            subStatus: status.slice(-1)[0].status,
            description:
              'Request to participate sent to all the editors including you',
          },
        ],
        role: user.role.activeRole,
        // orderTitle: project.title,
        // projectId: project.id,
        // url: 'Project',
      });
      await this.notificationsRepository.save(newN);
    }
    return 'Notification sent';
  }

  async notificationRequestToParticipateForTask(task, user: User) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(user.id),
      userId: getString(task.userId),
      commonId: getString(id),
      notificationType: NotificationType.TaskParticipationRequest,
      notificationTitle: `Task: ${title}`,
      notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].mainStatus,
          subStatus: status.slice(-1)[0].mainStatus,
          description:
            'Request to participate in task sent to the chief editor',
        },
      ],
      role: user.role.activeRole,
      // orderTitle: task.title,
      // taskId: task.id,
      // url: 'Task',
    });
    return this.notificationsRepository.save(newN);
  }

  async notificationJRequest(
    title: string,
    userIdToSend: string,
    user: User,
    descriptionType: string,
    person: string,
    dynamic: object,
    action: string,
    statusToSend: string,
  ) {
    let d = {
      date: new Date().toISOString(),
      userId: getString(userIdToSend),
      fromId: getString(user.id),
      commonId: getString(user.id),
      notificationType:
        descriptionType.toLowerCase() === 'assisstance request'
          ? NotificationType.AssistanceRequestAcceptance
          : descriptionType.toLowerCase() === 'project'
          ? NotificationType.ProjectInvitationAcceptance
          : descriptionType.toLowerCase() === 'task'
          ? NotificationType.TaskInvitationAcceptance
          : null,
      notificationTitle: title,
      notificationTypeRelatedId: getString(user.id),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: statusToSend,
          subStatus: statusToSend,
          description: `Join request for ${descriptionType} ${action} by ${person}`,
        },
      ],
      // orderTitle: title,
      role: user.role.activeRole,
      // url: 'Project',
      // notificationFrom: (descriptionType = 'Assisstance Request'
      //   ? 'Assistance Request'
      //   : 'Task'),
    };

    d = { ...d, ...dynamic };
    return this.notificationsRepository.create(d);
  }

  async taskRejectByManager(task, user: User) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(user.id),
      userId: getString(task.userId),
      commonId: getString(id),
      notificationType: NotificationType.AssistanceRequestRejection,
      notificationTitle: `Task: ${title}`,
      notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].mainStatus,
          subStatus: status.slice(-1)[0].mainStatus,
          description: 'Assistance Request Rejected by Client Manager',
        },
      ],
      // orderTitle: task.title,
      role: user.role.activeRole,
      // taskId: task.id,
      // url: 'Task',
    });
    return this.notificationsRepository.save(newN);
  }

  async taskAcceptedByMember(task, user: User) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(task.userId),
      fromId: getString(user.id),
      commonId: getString(id),
      notificationType: NotificationType.TaskInvitationAcceptance,
      notificationTitle: `Task: ${title}`,
      notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].mainStatus,
          subStatus: status.slice(-1)[0].mainStatus,
          description: 'Task Accepted by this member',
        },
      ],
      // orderTitle: task.title,
      role: user.role.activeRole,
      // taskId: task.id,
      // url: 'Task',
    });
    return this.notificationsRepository.save(newN);
  }

  // notification for chief editor after uploading document by editor
  async notificationForChiefEditorDocumentUploadedByEditor(
    task: Task,
    user: User,
  ) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(task.userId), // projected created by  && for whom this notification is
      commonId: getString(id), // who created
      fromId: getString(user.id),
      notificationType: NotificationType.DocumentUpload,
      notificationTitle: `Task: ${title}`,
      notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: status.slice(-1)[0].mainStatus,
          subStatus: status.slice(-1)[0].subStatus,
          description: 'Editor uploaded document',
        },
      ],
      // orderTitle: task.title,
      role: user.role.activeRole,
      // taskId: task.id,
      // url: 'Task',
    });
    return this.notificationsRepository.save(newN);
  }

  // notification for memeber involved in the task
  async notificationForApproval(task: Task, user: User, description: string) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    for (let i = 0; i < task.teamMember.length; i++) {
      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        fromId: getString(user.id),
        userId: getString(task.teamMember[i].userId), // notificaton for
        commonId: getString(id), //approved by
        notificationType: NotificationType.TaskApproval,
        notificationTitle: `Task: ${title}`,
        notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
        hasRead: false,
        status: [
          {
            date: new Date().toISOString(),
            mainStatus: status.slice(-1)[0].mainStatus,
            subStatus: status.slice(-1)[0].subStatus,
            description: `${description} approved the task`,
          },
        ],
        // orderTitle: task.title,
        // role: user.role.activeRole,
        // taskId: task.id,
        // url: 'Task',
      });
      return this.notificationsRepository.save(newN);
    }
  }

  async cmApproval(task, user: User) {
    const { id, title, status } = task;

    const taskRelatedProjectObjectId = task.projectId;

    for (let i = 0; i < task.teamMember.length; i++) {
      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        fromId: getString(user.id),
        userId: getString(task.teamMember[i].userId), // notificaton for
        commonId: getString(id), // approved by
        notificationType: NotificationType.TaskApproval,
        notificationTitle: `Task: ${title}`,
        notificationTypeRelatedId: getString(taskRelatedProjectObjectId),
        hasRead: false,
        status: [
          {
            date: new Date().toISOString(),
            mainStatus: status.slice(-1)[0].mainStatus + 'ccccccccccccccc',
            subStatus: status.slice(-1)[0].mainStatus,
            description:
              'Client Manager approved the task and is now complete.',
          },
        ],
        // orderTitle: task.title,
        role: user.role.activeRole,
        // taskId: task.id,
        // url: 'Task',
      });
      return this.notificationsRepository.save(newN);
    }
  }

  async markRead(notifications: Notifications[], user: User) {
    if (!notifications || notifications.length < 1) return 'No notifications';

    for (let notification of notifications) {
      const objectId = getObjectId(notification.id);
      const _notification: Notifications =
        await this.notificationsRepository.findOne(objectId);

      _notification.hasRead = true;
      await this.notificationsRepository.save(_notification);
    }
    return 'Notification has been read';
  }

  async getUnseenNotification(user: User) {
    try {
      const lists = await this.notificationsRepository.find({
        where: { hasRead: false, userId: user.id.toString() },
      });
      return lists;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  // change status of notification when order is in progress
  async orderInReview(oldOrder) {
    // update previous notification status
    // console.log('old order', oldOrder);
    const prevN = await this.notificationsRepository.findOne({
      where: {
        notificationTypeRelatedId: oldOrder.id.toString(),
        notificationTitle: oldOrder.journalTitle,
      },
    });

    // console.log(prevN);
    if (!prevN) {
      console.log('no prevN', prevN);
      return {
        message: 'Notification not found',
      };
      // throw new NotFoundException('Notification not found');
    }

    prevN.status.push({
      date: new Date().toISOString(),
      mainStatus: 'In Progress',
      subStatus: 'In Progress',
      description: 'Order is being reviewed.',
    });
    return this.notificationsRepository.save(prevN);
  }

  async sendAcceptNotification(oId, mId) {
    const { id, userId, journalTitle } = oId;

    const userM = await this.userRepository.findOne(mId);
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(mId),
      userId: getString(userId),
      commonId: getString(id),
      notificationType: NotificationType.OrderAccept,
      notificationTitle: `Order: ${journalTitle}`,
      notificationTypeRelatedId: getString(id),
      hasRead: false,
      status: [
        {
          mainStatus: 'order confirmed',
          subStatus: 'order confirmed',
          date: new Date().toISOString(),
          description: 'Order Confirmed. Now order in progress.',
        },
      ],
      // orderId: id.toString(),
      // commonId: mId.toString(),
      // url: 'Order',
      // orderTitle: journalTitle,
      // notificationFrom: 'Client manager',
      role: userM.role.activeRole,
      // role: mId.role.activeRole ,
    });
    this.notificationsRepository.save(newN);

    // update previous notification status
    const prevN = await this.notificationsRepository.findOne({
      where: {
        notificationTypeRelatedId: id.toString(),
        // role: mId.role,
      },
    });
    // console.log('PrevN', prevN);
    prevN.status = [
      {
        date: new Date().toISOString(),
        mainStatus: 'order confirmed',
        subStatus: 'order confirmed',
        description: 'Order Confirmed. Now order in progress.',
      },
    ];

    return this.notificationsRepository.save(prevN);
  }

  async sendRejectNotification(order, mId) {
    const { id, userId, status, personalInformation, orderTitle } = order;
    const objectId = getObjectId(mId);
    const manager = await this.userRepository.findOne(objectId);
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(userId),
      fromId: getString(mId),
      commonId: getString(id), // rejected by
      notificationType: NotificationType.OrderReject,
      notificationTitle: `Order: ${orderTitle}`,
      notificationTypeRelatedId: getString(id),
      hasRead: false,
      status: status.splice(1, 1, {
        date: new Date().toISOString(),
        status: 'order cancelled',
        description: 'Order Cancelled. Please try again Later.',
      }),
      // orderTitle,
      // status: [
      //   {
      //     date: new Date().toISOString(),
      //     status: 'order cancelled',
      //     description: 'Order Cancelled. Please try again Later.',
      //   },
      // ],
      // orderId: id.toString(),
      // name: personalInformation.name.english.first,
      role: manager.role.activeRole,
      // url: 'Order',
      // notificationFrom: 'Client manager',
    });

    return this.notificationsRepository.save(newN);
    //   // update previous notification status
    //   const prevN = await this.notificationsRepository.findOne({
    //     where: {
    //       orderId: id.toString(),
    //       role: 'CM',
    //     },
    //   });

    //   prevN.status.push({
    //     date: new Date().toISOString(),
    //     status: 'order rejected',
    //     description: 'Order Not Confirmed.',
    //   });
    //   await this.notificationsRepository.save(prevN);
    // }
  }

  // read all clicked by user
  async markReadByUser() {
    try {
      const lists = await this.notificationsRepository.find({
        where: { hasRead: false },
      });
      if (lists) {
        for (let i = 0; i < lists.length; i++) {
          lists[i].hasRead = true;
        }
        this.notificationsRepository.save(lists);
        return lists;
      }
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async assistanceRequest(newAssistanceService, teamMember, reviewedBy) {
    // send notification to all the teamMembers inside that newAssistanceService.
    for (let i = 0; i < teamMember.length; i++) {
      const { orderId, userId, journalTitle } = newAssistanceService;
      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        userId: getString(teamMember[i].userId),
        fromId: getString(userId),
        commonId: getString(orderId),
        notificationType: NotificationType.AssistanceRequest,
        notificationTitle: `Order: ${journalTitle}`,
        notificationTypeRelatedId: getString(orderId),
        hasRead: false,
        status: [
          {
            date: new Date().toISOString(),
            mainStatus: 'pending',
            subStatus: '',
            description:
              'New order arrived. please Accept or Reject this request.',
          },
        ],
        // orderId,
        // orderTitle: journalTitle,
        role: 'CU',
        // url: 'Assistance Request',
      });
      this.notificationsRepository.save(newN);
    }
  }

  async assistanceRequestAccept(newAssistanceService, reviewedBy) {
    const { orderId, userId, journalTitle, status } = newAssistanceService;
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(reviewedBy),
      userId: getString(userId),
      commonId: getString(newAssistanceService.id),
      notificationType: NotificationType.AssistanceRequestAcceptance,
      notificationTitle: `Order: ${journalTitle}`,
      notificationTypeRelatedId: orderId,
      hasRead: false,
      status: status,
      //  put role as cu inside object
      // orderId,
      // orderTitle: journalTitle,
      // status: status[0].status,
      role: 'CU',
      // url: 'Assistance Request Accepted',
    });
    return this.notificationsRepository.save(newN);
  }

  async assistanceRequestReject(newAssistanceService, reviewedBy) {
    const { orderId, userId, journalTitle, status } = newAssistanceService;
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(reviewedBy),
      userId: getString(userId),
      commonId: getString(newAssistanceService.id),
      notificationType: NotificationType.AssistanceRequestRejection,
      notificationTitle: `Order: ${journalTitle}`,
      notificationTypeRelatedId: orderId,
      hasRead: false,
      status: status,
      // orderId,
      // orderTitle: journalTitle,
      role: 'CU',
      // url: 'Assistance Request Rejected',
    });
    return this.notificationsRepository.save(newN);
  }

  // send notification for admin to add role
  async sendNotificationForRole(pid, role) {
    const admin = await this.userRepository.findOne({
      where: { 'role.activeRole': 'AM' },
    });
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(role.id),
      userId: getString(admin.id),
      commonId: pid.userId,
      notificationType: NotificationType.RoleRequest,
      notificationTitle: `Role: ${pid.title}`,
      notificationTypeRelatedId: null,
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: 'Pending',
          subStatus: 'Pending',
          description: 'Request to add role',
        },
      ],
      role: role,
      // orderTitle: pid.title,
      // url: 'Role',
    });
    return this.notificationsRepository.save(newN);
  }

  // send notification for user to add role
  async sendAcceptNotificationRoleForUser(pid, nId) {
    const objectId = getObjectId(nId);
    const admin = await this.userRepository.findOne({
      where: { 'role.activeRole': 'AM' },
    });
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(pid.userId),
      fromId: getString(pid.id),
      commonId: getString(admin.id),
      notificationType: NotificationType.RoleRequestAccept,
      notificationTitle: `Request to add role approved`,
      notificationTypeRelatedId: null,
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: 'Approved',
          subStatus: 'Approved',
          description: 'Request to add role approved',
        },
      ],
      // orderTitle: 'Request to add role',
      role: pid.profileData.role.activeRole,
      // url: 'Role',
    });

    const prevNotice = await this.notificationsRepository.findOne(objectId);
    prevNotice.status.push({
      date: new Date().toISOString(),
      mainStatus: 'Request Accepted',
      subStatus: 'Request Accepted',
      description: 'Request to add role accepted',
    });
    this.notificationsRepository.save(newN);
    this.notificationsRepository.save(prevNotice);
  }

  async sendRejectNotificationRoleForUser(pid, nId) {
    const objectId = getObjectId(nId);
    const admin = await this.userRepository.findOne({
      where: { 'role.activeRole': 'AM' },
    });
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(pid.userId),
      fromId: getString(pid.id),
      commonId: getString(admin.id),
      notificationType: NotificationType.RoleRequestReject,
      notificationTitle: `Request to add role rejected`,
      notificationTypeRelatedId: null,
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: 'Rejected',
          subStatus: 'Rejected',
          description: 'Failed to update role',
        },
      ],
      role: pid.profileData.role.activeRole,
      // orderTitle: 'Rejected to add role',
      // url: 'Role',
    });
    const prevNotice = await this.notificationsRepository.findOne(objectId);
    prevNotice.status.push({
      date: new Date().toISOString(),
      mainStatus: 'Request Rejected',
      subStatus: 'Request Rejected',
      description: 'Request to add role rejected',
    });
    this.notificationsRepository.save(newN);
    this.notificationsRepository.save(prevNotice);
  }

  // send notification for admin of Employee Termination
  async resignationNoticeForAdmin(resignation) {
    const admin = await this.userRepository.findOne({
      where: { 'role.activeRole': 'AM' },
    });
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(admin.id),
      fromId: getString(admin.id),
      commonId: getString(resignation.employee_id),
      notificationType: NotificationType.EmployeeResignation,
      notificationTitle: `Request for resignation`,
      notificationTypeRelatedId: getString(resignation.employee_id),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: 'Resignation of Employee',
          subStatus: 'Resignation of Employee',
          description: 'Request for resignation by employee',
        },
      ],
      role: 'AM',
      // orderTitle: 'Request to resignation',
      // url: 'Resignation of Employee',
    });
    return this.notificationsRepository.save(newN);
  }

  // accept resignation of epmloyee by admin
  async resignationAccept(resignation) {}

  // mark as paid notification for admin
  async markAsPaidNoticeForAdmin(reviewOrder) {
    const admin = await this.userRepository.findOne({
      where: { 'role.activeRole': 'AM' },
    });
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      fromId: getString(admin.id),
      userId: getString(admin.id),
      commonId: getString(reviewOrder.id),
      notificationType: NotificationType.Billing,
      notificationTitle: 'Paid',
      notificationTypeRelatedId: getString(reviewOrder.id),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: 'Resignation of Employee',
          subStatus: 'Resignation of Employee',
          description: 'Request to add role approved',
        },
      ],
      role: 'CU',
      // orderTitle: 'Request to resignation',
      // url: 'Resignation of Employee',
    });
    return this.notificationsRepository.save(newN);
  }

  // send notification for admin when invoice is generated
  async invoiceGeneratedNoticeForAdmin(rvwOrder) {
    const admin = await this.userRepository.findOne({
      where: { 'role.activeRole': 'AM' },
    });
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(admin.id),
      fromId: getString(admin.id),
      commonId: getString(rvwOrder.id),
      notificationType: NotificationType.Billing,
      notificationTitle: 'Invoice Generated by Billing Manager',
      notificationTypeRelatedId: getString(rvwOrder.id),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: 'Invoiced',
          subStatus: 'Invoiced',
          description: 'Invoice Generated',
        },
      ],
      role: 'BM',
      // orderTitle: 'Invoice Generated by Billing Manager',
      // url: 'Review Order',
    });
    return this.notificationsRepository.save(newN);
  }

  // overdeu notification for admin
  async overdueNoticeForAdmin(order) {
    const admin = await this.userRepository.findOne({
      where: { 'role.activeRole': 'AM' },
    });

    // const objectId = getObjectId(order.id);
    // const order=
    const newN = this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(admin.id),
      fromId: getString(admin.id),
      commonId: getString(order.id),
      notificationType: NotificationType.Overdue,
      notificationTitle: 'Order delay in delivery',
      notificationTypeRelatedId: getString(order.id),
      hasRead: false,
      status: [
        {
          date: new Date().toISOString(),
          mainStatus: 'Order Overdue',
          subStatus: 'Order Overdue',
          description: 'Order delay in delivery',
        },
      ],
      role: 'CU',
      // url: 'Overdue',
      // orderTitle: 'Order delay in delivery',
    });
    return this.notificationsRepository.save(newN);
  }

  // send notification for payroll PR when project is closed
  async projectClosedNoticeForPayroll(project) {
    const { orderId } = project;
    const orderObjectId = getObjectId(orderId);
    const order = await this.orderRepository.findOne(orderObjectId);

    const payrollManager = await this.userRepository.find({
      where: { 'role.mainRoles': { $in: ['PR'] } },
    });

    console.log('Project Pro', project);
    console.log('payrollManager', payrollManager);

    for (let i = 0; i < payrollManager.length; i++) {
      const newN = this.notificationsRepository.create({
        date: new Date().toISOString(),
        userId: getString(payrollManager[i].id),
        fromId: getString(order.reviewedBy),
        commonId: getString(project.projectId),
        notificationType: NotificationType.ProjectClosed,
        notificationTitle: 'Project closed',
        notificationTypeRelatedId: project.projectId,
        hasRead: false,
        status: [
          {
            date: new Date().toISOString(),
            mainStatus: 'Project Closed',
            subStatus: 'Project Closed',
            description: 'Project Closed',
          },
        ],
        // orderTitle: 'Project Closed',
        role: 'CM',
        // url: 'Project',
      });
      this.notificationsRepository.save(newN);
    }

    // payrollManager.map((_, i) => {
    //   const newN = this.notificationsRepository.create({
    //     userId: payrollManager[i].id.toString(),
    //     date: new Date().toISOString(),
    //     commonId: project.id.toString(),
    //     orderTitle: 'Project Closed',
    //     hasRead: false,
    //     status: [
    //       {
    //         date: new Date().toISOString(),
    //         mainStatus: 'Project Closed',
    //         subStatus: 'Project Closed',
    //         description: 'Project Closed',
    //       },
    //     ],
    //     role: 'PR',
    //     url: 'Project',
    //     fromId: project.id.toString(),
    //   });
    //   this.notificationsRepository.save(newN);
    // });
  }

  async inviteFindPeople(oldTask, newTeamMember) {
    try {
      const { projectId } = oldTask;
      const projectObjectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne(projectObjectId);
      const { userId } = newTeamMember;

      newTeamMember.map(async (item, i) => {
        const newN = this.notificationsRepository.create({
          date: new Date().toISOString(),
          fromId: getString(project.createdBy),
          userId: getString(item.userId),
          commonId: getString(projectId),
          notificationType: NotificationType.ProjectInvitation,
          notificationTitle: 'Invite to join project',
          notificationTypeRelatedId: projectId,
          hasRead: false,
          status: [
            {
              date: new Date().toISOString(),
              mainStatus: 'Invite to join project',
              subStatus: 'Invite to join project',
              description: 'Invite to join project',
            },
          ],
          role: 'CM',
          // orderTitle: 'Invite to join project',
          // url: 'Project',
        });
        this.notificationsRepository.save(newN);
      });
    } catch (err) {
      console.log(err);
      // throw
    }
  }

  async orderDeliveryNotification(reviewOrder) {
    const { orderId } = reviewOrder;
    const orderObjectId = getObjectId(orderId);
    const order = await this.orderRepository.findOne(orderObjectId);

    const notification = await this.notificationsRepository.create({
      date: new Date().toISOString(),
      userId: getString(order.userId),
      fromId: getString(order.reviewedBy),
    });
  }

  async requestDeliveryNotification(reviewOrder) {}
}
