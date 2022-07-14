import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SaveBillingInfoDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  billingType: string;

  @IsString()
  @IsOptional()
  organizationName: string;

  @IsString()
  @IsOptional()
  departmentName: string;

  @IsString()
  @IsOptional()
  invoiceAddress: string;

  @IsString()
  @IsOptional()
  postalCode: string;

  @IsString()
  @IsOptional()
  region: string;

  @IsBoolean()
  @IsOptional()
  default?: boolean;
}
