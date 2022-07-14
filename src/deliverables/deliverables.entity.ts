import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'deliverables' })
export class Deliverables {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  title: string;

  @Column()
  date: string;

  @Column()
  invoiceId: string;

  @Column()
  totalCost: string;

  @Column()
  documents: {
    manuscripts: {
      createdAt: string;
      updatedAt: string;
      files: [
        {
          name: string;
          url: string;
          type: string;
          uploadedBy: string;
          uploadedDate: string;
          size: string;
          storageUsed: string;
        },
      ];
    };
    invoices: {
      createdAt: string;
      updatedAt: string;
      files: [
        {
          name: string;
          url: string;
          type: string;
          uploadedBy: string;
          uploadedDate: string;
          size: string;
          storageUsed: string;
        },
      ];
    };
  };
}
