import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IBreakTime, IWorkTime } from './interfaces';

@Entity({ name: 'contractor-tracks' })
export class ContractorTracks {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  workingTime: IWorkTime[];

  @Column()
  breakTime: IBreakTime[];
}
