import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { IProject, IRoleWisePaymentInfo, ITrackedTimePayment } from './interfaces';

@Entity({ name: 'payrollTeamsummary' })
export class PayrollTeamsummary {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  createdDate: string;

  @Column()
  employeeId: string;

  @Column()
  payrollId: string;

  @Column()
  employeeName: string;

  @Column()
  paymentStatus: string;

  @Column()
  employeeImage: string;

  @Column()
  employmentType: string;

  @Column()
  payPerHour?: string | number;

  @Column()
  trackedTime?: ITrackedTimePayment[];

  @Column()
  payment: IRoleWisePaymentInfo[];

  @Column()
  projects: IProject[];
}
