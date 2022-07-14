import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import {
  Department,
  Disciplinary_Case,
  Notes,
  SalaryDetails,
  Roles,
} from './interfaces';

@Entity({ name: 'employee' })
export class Employee {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  employmentType: string;

  @Column()
  prescribedTime: string;

  @Column()
  userId: string;

  @Column()
  image: string;

  @Column()
  status: string;

  @Column()
  salutation: string;

  @Column()
  fullName: string;

  @Column()
  workEmail: string;

  @Column()
  personalEmail: string;

  @Column()
  startDate: string;

  // @Column()
  // department: Department[];

  @Column()
  department: string;

  @Column()
  division: string;

  @Column()
  unit: string[];

  // @Column()
  // notes: Notes[];

  @Column()
  notes: Array<{
    title: string;
    description: string;
    createdDate: string;
  }>;

  @Column()
  role: Roles;

  @Column()
  tasks: string[];

  @Column()
  companyProperty: string[];

  @Column()
  salaryDetails: SalaryDetails;

  @Column()
  disciplinaryCase: Disciplinary_Case[];

  @Column()
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
}
