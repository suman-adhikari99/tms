import { Transform } from "class-transformer";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { Day } from "./interfaces";

@Entity({ name: 'availability' })
export class Availability {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  userId: string;

  @Column()
  employeeId: string;

  @Column()
  availableDays: Day[];
}
