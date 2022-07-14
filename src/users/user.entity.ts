import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, Index, ObjectIdColumn, OneToMany } from 'typeorm';
import { IApplicationUser, IUserFeedback, Roles } from './interfaces';

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  requestedRole: string[];

  @Column()
  savedBy: Array<{
    userId: string;
    projectId: string;
  }>;

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
  role: Roles;

  // @Column()
  // reviews: string;

  // @Column()
  // rating: string;

  @Column()
  feedbacks: IUserFeedback[];

  @Index("userName")
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telephoneNumber: string;

  @Column()
  institutionName: string;

  @Column()
  departmentName: string;

  @Column()
  positionTitle: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  newPassword: string;

  @Column()
  salutation: string;

  @Column()
  specialization: string[];

  @Column()
  image: string;

  @Column()
  isFirstTime: boolean;

  @Column()
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    swiftCode: string;
  };

  @Column()
  billingAddress: {
    title: string;
    fullName: string;
    govermentNumber: string;
    address: string;
    postalCode: string;
    region: string;
  };

  @Column()
  applicationUser?: IApplicationUser;

  // @Column()
  // contractorUser: IContractorUser;

  //   @ObjectIdColumn()
  //   @Transform(({ value }) => value.toString())
  //   id: string;

  //   @Column()
  //   role: string;

  //   @Column()
  //   firstName: string;

  //   @Column()
  //   middleName: string;

  //   @Column()
  //   lastName: string;

  //   @Column()
  //   username: string;

  //   @Column({ unique: true })
  //   email: string;

  //   @Column()
  //   @Exclude()
  //   password: string;

  //   @Column()
  //   address: string;

  //   @Column()
  //   phone: string;

  //   @Column()
  //   salutation: string[];

  //   @Column()
  //   applicationUser?: IApplicationUser;
  //
}
