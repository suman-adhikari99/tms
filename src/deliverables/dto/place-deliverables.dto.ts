import { Type } from 'class-transformer';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';

export class Files {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsString()
  uploadedBy: string;

  @IsString()
  size: string;

  @IsString()
  storageUsed: string;
}
export class Manuscripts {
  @IsArray()
  files: string[];

  // or

  // @IsArray()
  // files: Array<{
  //   name: string;
  //   url: string;
  //   type: string;
  //   uploadedBy: string;
  //   uploadedDate: string;
  //   size: string;
  //   storageUsed: string;
  // }>;
}

export class Invoices {
  @IsArray()
  files: string[];
}

export class Documents {
  @IsObject()
  manuscripts: Manuscripts;

  @IsObject()
  invoices: Invoices;
}

export class PlaceDeliverablesDto {
  @IsString()
  title: string;

  @IsString()
  invoiceId: string;

  @IsString()
  totalCost: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Documents)
  documents: Documents;
}
