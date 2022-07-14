import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'teamSummary' })
export class TeamSummary {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  commonId: string;

  @Column()
  teamSummary: Array<{
    employeeId: string;
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
  }>;
}
