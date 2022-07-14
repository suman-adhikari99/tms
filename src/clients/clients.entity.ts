import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IBillingAddress } from './interface';

@Entity({ name: 'clients' })
export class Clients {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  orderId: string;

  @Column()
  userId: string;

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
    telephoneNumber: number;
  };

  @Column()
  billingAddress?: IBillingAddress[];

  // billingAddress: Array<{
  //   title: string;
  //   billingType: string;
  //   region: string;
  //   departmentName: string;
  //   invoiceAddress: string;
  //   organizationName: string;
  //   postalCode: string;
  //   default: boolean;
  // }>;

  // @Column()
  // billingAddress: {
  //   title: string;
  //   billingType: string;
  //   region: string;
  //   departmentName: string;
  //   invoiceAddress: string;
  //   organizationName: string;
  //   postalCode: string;
  //   default: boolean;
  // };
}
