import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface ITeamMember {
  name: string;
  userId: string;
  role: string;
  imageUrl: string;
  isJoined: boolean;
  joinedDate: string;
  invited: boolean;
  declined: boolean;
}

export class TeamMember implements ITeamMember {
  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsString()
  role: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isJoined: boolean;

  @IsOptional()
  @IsString()
  joinedDate: string;

  @IsOptional()
  @IsBoolean()
  invited: boolean;

  @IsOptional()
  @IsBoolean()
  declined: boolean;
}

export interface IOptionalService {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  discountPercent: number;
}

export class OptionalService implements IOptionalService {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  serviceId: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  discountPercent: number;
}

export interface IOrderBillingInfo {
  title: string;
  billingType: string;
  organizationName: string;
  departmentName: string;
  invoiceAddress: string;
  postalCode: string;
  region: string;
  default?: boolean;
}

export class OrderBillingInfo implements IOrderBillingInfo {
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

export interface IOptionalManuscriptDocument {
  uploadedBy?: string;
  filePath?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  fileId?: string;
  uploadedAt?: string;
  uploadedTime?: string;
}

export interface IServiceDetail {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  discountPercent: number;
  list: string[];
}

export class ServiceDetail implements IServiceDetail {
  @IsString()
  id: string;

  @IsString()
  serviceId: string;

  @IsString()
  name: string;

  @IsString()
  price: number;

  @IsString()
  discountPercent: number;

  @IsArray()
  list: string[];
}

export class OptionalManuscriptDocument implements IOptionalManuscriptDocument {
  @IsOptional()
  @IsString()
  uploadedBy: string;

  @IsString()
  filePath: string;

  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsString()
  fileSize: string;

  @IsOptional()
  @IsString()
  fileId: string;

  @IsOptional()
  @IsString()
  uploadedAt: string;

  @IsOptional()
  @IsString()
  uploadedTime: string;
}
