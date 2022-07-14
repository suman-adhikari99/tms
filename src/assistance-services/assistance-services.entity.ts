import { Transform } from 'class-transformer';
import { IBillingAddress } from 'src/clients/interface';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { IOptionalManuscriptDocument, IServiceDetail } from './interfaces';

@Entity({ name: 'assistance-services' })
export class AssistanceServices {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  orderId: string;

  @Column()
  date: string;

  @Column()
  status: Array<{
    date: string;
    status: string;
    description: string;
  }>;

  @Column()
  title: string;

  @Column()
  userId: string;

  @Column()
  assistantType: string;

  @Column()
  serviceType: string;

  @Column()
  serviceDetail?: IServiceDetail;

  @Index("fileName")
  @Column()
  optionalManuscriptDocument?: IOptionalManuscriptDocument;

  @Column()
  query: string;

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
}

// import { Transform } from 'class-transformer';
// import { Column, Entity, ObjectIdColumn } from 'typeorm';

// @Entity({ name: 'assistance-services' })
// export class AssistanceServices {
//   @ObjectIdColumn()
//   @Transform(({ value }) => value.toString())
//   id: string;

//   @Column()
//   orderId: string;

//   @Column()
//   userId: string;

//   @Column()
//   assistantType: string;

//   @Column()
//   serviceType: string;

//   @Column()
//   serviceDetail: string;

//   @Column()
//   optionalManuscriptDocument: string;

//   @Column()
//   query: string;

//   @Column()
//   billingAddress: string;

//   @Column()
//   TotalCostNoVAT: string;

//   @Column()
//   discountTag: string;
// }
