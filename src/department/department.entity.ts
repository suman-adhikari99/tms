import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'department' })
export class Department {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  departmentName: string;

  @Column()
  division: Array<{
    divisionId: string;
    divisionName: string;
    unitName: string[];
  }>;
}
// @Column()
// unit: Array<{
//   unitName: string;
//   departmentName: string;
//   divisionName: string;
// }>;
