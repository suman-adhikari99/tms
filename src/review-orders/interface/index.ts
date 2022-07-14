import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export interface IBillingAddress {
  id: string;
  title: string;
  billingType: string;
  region: string;
  departmentName: string;
  invoiceAddress: string;
  organizationName: string;
  postalCode: string;
  default: boolean;
}
export interface IManuscriptFile {
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: string;
}

export class ManuscriptFile implements IManuscriptFile {
  @IsString()
  filePath: string;

  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsString()
  fileSize: string;
}

export class BillingAddress implements IBillingAddress {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  billingType: string;

  @IsString()
  region: string;

  @IsString()
  departmentName: string;

  @IsString()
  invoiceAddress: string;

  @IsString()
  organizationName: string;

  @IsString()
  postalCode: string;

  @IsString()
  userId: string;

  @IsBoolean()
  default: boolean;
}
