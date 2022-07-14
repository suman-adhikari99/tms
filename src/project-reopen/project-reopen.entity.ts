import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import {
  IJoinRequest,
  IDeliveryPlan,
  IPlan,
  IService,
  ITeamMember,
  IProjectTeamMember,
} from 'src/projects/interfaces';

@Entity({ name: 'projectReopen' })
export class ProjectReopen {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  projectId: string;

  @Column()
  specialRequest: string;

  @Column()
  payrollStatus: string;

  @Column()
  JoinRequest?: IJoinRequest[];

  @Column()
  orderId: string;

  @Column()
  createdBy: string;

  @Column()
  status: Array<{
    date: string;
    status: string;
  }>;

  @Column()
  teamMember?: IProjectTeamMember[];

  @Column()
  teamSummary: Array<{
    employeeId: string;
    userId: string;
    fullName: string;
    image: string;
    employmentType: string;
    role: string;
    status: string;
    salaryDetails: {
      group: string;
      priority: string;
      benefits: string[];
      deduction: string[];
    };
    paidTask: string;
    netPay: string;
  }>;

  @Column()
  deliveryPlan?: IDeliveryPlan;

  // @Column()
  // deliveryPlan: {
  //   id: string;
  //   serviceId: string;
  //   planSchedule: number;
  //   cost: number;
  // };

  @Column()
  deliveryDate: string;

  @Column()
  title: string;

  @Column()
  tasks: string;

  @Column()
  addNotes: string;

  @Column()
  numberOfWords: number;

  @Column()
  editors: number;

  @Column()
  projectNumber: string;

  @Column()
  serviceType: string;

  @Column()
  createdDate: string;

  @Column()
  activeDocuments: {
    label: string;
    document: Array<{
      uploadedBy: string;
      fileName: string;
      filePath: string;
      fileType: string;
      fileSize: string;
      fileId: string;
      uploadedAt: string;
      uploadedTime: string;
    }>;
  };

  @Column()
  supportingDocuments: {
    label: string;
    document: Array<{
      uploadedBy: string;
      fileName: string;
      filePath: string;
      fileType: string;
      fileSize: string;
      fileId: string;
      uploadedAt: string;
      uploadedTime: string;
    }>;
  };

  @Column()
  assignmentType: string;

  @Column()
  manuscriptType: string;

  @Column()
  manuscriptPurpose: string;

  @Column()
  targetJournalUrl: string;

  @Column()
  language: string;

  @Column()
  numberWords: number;

  @Column()
  deliverables: string;

  @Column()
  instruction: string;

  @Column()
  specialities: string;

  @Column()
  priority: string;

  @Column()
  service?: IService;

  @Column()
  plan?: IPlan;

  @Column()
  isOpen: boolean;
}
