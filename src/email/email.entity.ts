import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';

@Entity({ name: 'email' })
export class Email {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  to: string[];

  @Column()
  from: string;

  @Column()
  subject: string;

  @Column()
  content: string;

  @Column()
  attachments: Array<{
    uploadedBy: string;
    filePath: string;
    fileName: string;
    fileType: string;
    fileSize: string;
    fileId: string;
    uploadedAt: string;
    uploadedTime: string;
  }>;

  @Column()
  seen: string[];

  @Column()
  isArchived: boolean = false;

  @Column()
  draft: boolean = false;

  @Column()
  scheduledDate: string | null = null;

  @Column()
  scheduledDeliveryCommonId: string | null = null;
  
  @Column()
  createdDate: string;
}
