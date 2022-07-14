import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ResignationLetter } from './interfaces';
@Entity({ name: 'resignation' })
export class Resignation {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  employee_id: string;

  @Column()
  dateOfSubmission: string;

  @Column()
  lastWorkingDay: string;

  @Column()
  reasonForResignation: string;

  @Column()
  resignationLetter: ResignationLetter;
}
