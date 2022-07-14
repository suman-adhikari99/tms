import { Transform } from 'class-transformer';
import { IManuscriptFile } from 'src/project-closure/interface';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
@Entity('projectClosure')
export class RequestClosure {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  orderId: string;

  @Column()
  assistanceRequestId: string;

  @Column()
  evaluationCertificate: IManuscriptFile;

  @Column()
  editorCertificate: IManuscriptFile;
}
