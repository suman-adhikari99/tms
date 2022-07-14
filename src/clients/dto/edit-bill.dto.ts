import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import * as uuid from 'uuid';
export class BillingAddress {
  // generate uuid
  @IsString()
  id: string = uuid.v4();

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

  @IsBoolean()
  default: boolean;
}

export class EditBillDto {
  @IsOptional()
  @IsArray()
  billingAddress: BillingAddress[];
}
