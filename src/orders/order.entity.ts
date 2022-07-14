import { Transform } from 'class-transformer';
import { IBillingAddress } from 'src/clients/interface';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { IFeatures, IOrderFeedback, IStatus } from './interfaces';

@Entity()
export class Order {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  supportingDocuments: Array<{
    uploadedBy: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: string;
    fileId: string;
    uploadedAt: string;
    uploadedTime: string;
  }>;

  @Column()
  projectId: string;

  @Column()
  reviewOrderId: string;

  @Column()
  userId: string;

  @Column()
  reviewedBy: string;

  @Column()
  quotationStatus: string;

  @Column()
  invoice: {
    invoiceId: number;
    status: string;
    dueDate: string;
    createdDate: string;
    file: {
      uploadedBy: string;
      fileName: string;
      filePath: string;
      fileType: string;
      fileSize: string;
      fileId: string;
      uploadedAt: string;
      uploadedTime: string;
    };
  };

  @Column()
  totalServiceCost: number;

  @Column()
  manuscriptFile: Array<{
    uploadedBy: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: string;
    fileId: string;
    uploadedAt: string;
    uploadedTime: string;
  }>;

  @Column()
  omissionOtherSpecified: string;

  @Column()
  wordCount: number;

  @Column()
  orderDate: string;

  @Column()
  billingAddress: IBillingAddress;

  @Column()
  optionalServices: Array<{
    id: string;
    serviceId: string;
    name: string;
    price: number;
    discountPercent: number;
  }>;

  @Column()
  omissionSections: string[];

  @Column()
  omissionOther: string;

  @Column()
  academicField: string;

  @Column()
  specialty: string;

  @Column()
  manuscriptPurpose: string;

  @Column()
  manuscriptType: string;

  @Index("journalTitle")
  @Column()
  journalTitle: string;

  @Column()
  specialRequest: string;

  @Column()
  personalInformation: {
    name: {
      english: {
        first: string;
        last: string;
      };
      japanese: {
        first: string;
        last: string;
      };
      email: string;
      telephoneNumber: string;
      title: string;
    };
  };

  @Column()
  service: {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: string;
    availablePlans: number;
  };

  @Column()
  plan: {
    id: string;
    plan: string;
    serviceId: string;
    cost: number;
    points: string[];
  };

  @Column()
  feature: IFeatures;

  @Column()
  deliveryPlan: {
    id: string;
    serviceId: string;
    planSchedule: number;
    cost: number;
    expressService: string; // greater than two days
    deliveryDate: string;
  };

  @Column()
  editEntireDocument: string;

  @Column()
  wordReduction20Percent: string;

  @Column()
  language: string;

  @Column()
  status: IStatus[];

  @Column()
  feedback: IOrderFeedback; 

  @Column()
  orderDeliveryScheduledDate: string | null = null;

  // @Column()
  // status: Array<{
  //   date: string;
  //   status: string;
  //   description: string;
  // }>;
}
