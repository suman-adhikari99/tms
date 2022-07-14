import { Transform } from 'class-transformer';
import { IBillingAddress } from 'src/clients/interface';
import { IJoinRequest, IStatus } from 'src/task/interfaces';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import {
  IOptionalManuscriptDocument,
  IServiceDetail,
  ITeamMember,
} from './interfaces';

@Entity({ name: 'assistance-requests' })
export class AssistanceRequests {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  title: string;

  // @Column()
  // teamMember: Array<{
  //   userId: string;
  //   name: string;
  //   imageUrl: string;
  //   role: string;
  //   isJoined: boolean;
  //   joinedDate: string;
  //   declined: boolean;
  // }>;

  @Column()
  teamMember?: ITeamMember[];

  @Column()
  deliverableFiles: Array<{
    uploadedBy: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: string;
    fileId: string;
    uploadedAt: string;
    uploadedTime: string;
  }>;

  // @Column()
  // teamMember: IProjectTeamMember[];

  @Column()
  assistantType: string;

  @Column()
  serviceType: string;

  @Column()
  JoinRequest?: IJoinRequest[];

  @Column()
  status: IStatus[];

  @Column()
  date: string;

  @Column()
  query: string;

  @Column()
  orderId: string;

  @Column()
  userId: string;

  @Column()
  serviceDetail?: IServiceDetail;

  @Column()
  optionalManuscriptDocument?: Array<IOptionalManuscriptDocument>;

  @Column()
  billingAddress?: IBillingAddress;

  @Column()
  TotalCostNoVAT: number;

  @Column()
  discountTag: string;

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
    };
    email: string;
    telephoneNumber: string;
  };

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
  requestDeliveryScheduledDate: string | null = null;
}
