import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'payroll' })
export class Payroll {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  projectValidity: string[];

  @Column()
  payRollDate: string;

  @Column()
  status: string;

  @Column()
  adminStatus: string;

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
}
