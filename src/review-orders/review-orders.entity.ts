import { Transform } from 'class-transformer';
import { IStatus } from 'src/orders/interfaces';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('reviewOrders')
export class ReviewOrder {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Index("journalTitle")
  @Column()
  journalTitle: string;

  @Column()
  orderId: string;

  @Column()
  billingManagerId: string;

  @Column()
  userId: string;

  @Column()
  reviewedBy: string;

  @Column()
  orderDate: string;

  @Column()
  quotationStatus: string;

  @Column()
  quotationNumber: string;

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
  status: IStatus[];

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

  @Index("fileName")
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
  documentLanguage: string;

  @Column()
  authorName: string;

  @Column()
  documentWordCount: number;

  @Column()
  specialRequest: string;

  @Column()
  supportDocTitle: string;

  @Column()
  sections: Array<{
    title: string;
    words: number;
  }>;

  @Column()
  omitSections: string[];

  @Column()
  omissionOther: string;

  @Column()
  optionalServices: Array<{
    id: string;
    serviceId: string;
    name: string;
    price: number;
    discountPercent: number;
  }>;

  @Column()
  manuscriptOption: string;

  @Column()
  journalURL: string;

  @Column()
  manuscriptPurposeNotes: string;

  @Column()
  academicField: string;

  @Column()
  speciality: string;

  @Column()
  totalServiceCost: number;

  @Column()
  deliveryPlan: {
    id: string;
    serviceId: string;
    planSchedule: number;
    cost: number;
    expressService: string;
  };

  @Column()
  billingAddressReview: {
    id: string;
    title: string;
    billingType: string;
    organizationName: string;
    departmentName: string;
    invoiceAddress: string;
    postalCode: string;
    region: string;
    userId: string;
    default: boolean;
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
  editEntireDocument: string;

  @Column()
  wordReduction20Percent: string;

  @Column()
  language: string;

  @Column()
  billInfoTags: Array<{
    id: string;
    value: string;
  }>;

  @Column()
  billingInfoNotes: string;

  @Column()
  date: string;

  @Column()
  wordCount: number;

  @Column()
  omissionSections: string[];

  @Column()
  manuscriptPurpose: string;

  @Column()
  manuscriptType: string;

  // @Column()
  // status: Array<{
  //   date: string;
  //   status: string;
  //   description: string;
  // }>;
}

// @Column()
// billingAddressReview: IBillingAddress;
