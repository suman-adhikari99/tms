import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

export enum NotificationType {
  NewOrder = 'New Order',
  OrderReview = 'Order Review',
  OrderAccept = 'Order accept',
  OrderReject = 'Order Reject',
  AssistanceRequest = 'Assistance Request',
  AssistanceRequestAcceptance = 'Assistance Acceptance',
  AssistanceRequestRejection = 'Assistance Request Rejection',
  TaskInvitation = 'Task Invitation',
  TaskInvitationAcceptance = 'Task Invitation Acceptance',
  TaskInvitationRejection = 'Task Invitation Rejection',
  TaskParticipationRequest = 'Task Participation request',
  ProjectInvitation = 'Project Invitation',
  ProjectInvitationAcceptance = 'Project Invitation Acceptance',
  ProjectInvitationRejection = 'Project Invitation Rejection',
  ProjectParticipationRequest = 'Project Participation request',
  ProjectClosed = 'Project Closed',
  RoleRequest = 'Role Request',
  RoleRequestAccept = 'Role Request Accept',
  RoleRequestReject = 'Role Request Reject',
  DocumentUpload = 'Document Upload',
  TaskApproval = 'Task Approval',
  EmployeeResignation = 'Employee Resignation',
  Billing = 'Billing',
  Overdue = 'Overdue',
}

@Entity({ name: 'notifications' })
export class Notifications {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  date: string;

  @Column()
  fromId: string;

  @Column()
  userId: string;

  @Column()
  commonId: string;

  @Column()
  notificationType: NotificationType;

  @Column()
  notificationTitle: string;

  @Column()
  notificationTypeRelatedId: string;

  @Column()
  hasRead: boolean;

  @Column()
  status: Array<{
    date: string;
    mainStatus: string;
    description: string;
    subStatus: string;
  }>;

  // @Column()
  // issuerRole: string;

  // @Column()
  // issuedRole: string;

  // @Column()
  // orderTitle: string;

  // @Column()
  // orderId: string;

  // @Column()
  // url: string;

  // @Column()
  // projectId: string;

  // @Column()
  // taskId: string;

  // @Column()
  // notificationFrom: string;

  @Column()
  role: string;

  // @Column()
  // name: string;

  // @Column()
  // time: string;

  // @Column()
  // newNotification: number;
}
