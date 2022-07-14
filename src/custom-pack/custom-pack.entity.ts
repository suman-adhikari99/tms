import { Transform } from 'class-transformer';
import { IRows } from 'src/editing-services/interfaces';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'customPackFeatures' })
export class CustomPack {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  price: string;

  //   @Column()
  //   features: Array<{
  //     id: string;
  //     title: string;
  //     content: string[];
  //     price: string;
  //   }>;
}
