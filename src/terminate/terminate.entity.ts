import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import {
  ReasonForTermination,
  ReconciliationForm,
} from 'src/terminate/interface/index';
@Entity({ name: 'terminate_employee' })
export class Terminate {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  employeeId: string;

  @Column()
  password: string;

  @Column()
  dateOfSubmission: string;

  @Column()
  effectiveWorkingDate: string;

  @Column()
  submittedBy: string;

  @Column()
  lastWorkingDateByEmployee: string;

  @Column()
  terminationReason: string;

  @Column()
  terminationDetails: string;

  @Column()
  severanceDetails: string;

  @Column()
  rehireEligibility: boolean;

  @Column()
  lastWorkingDateByAdmin: string;

  @Column()
  lastPayrollDate: string;

  @Column()
  companyProperty: string[];

  @Column()
  exitCorrespondence: string[];

  @Column()
  terminationDocumentation: string[];

  @Column()
  reasonForTermination: ReasonForTermination[];

  @Column()
  ReconciliationForm: ReconciliationForm[];
}
