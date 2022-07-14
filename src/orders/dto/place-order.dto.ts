import { Optional } from '@nestjs/common';
import { Metadata } from 'aws-sdk/clients/appstream';
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
import { IFeatures } from '../interfaces';
export class BillingAddress {
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

export class OptionalService {
  @IsString()
  id: string;

  @IsString()
  serviceId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  discountPercent: number;
}

export class ManuscriptFile {
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

export class Name {
  @IsString()
  first: string;

  @IsString()
  last: string;
}

export class Names {
  @IsObject()
  @ValidateNested()
  english: Name;

  @IsObject()
  @ValidateNested()
  japanese: Name;
}

export class PersonalInformation {
  @IsString()
  email: string;

  @IsString()
  telephoneNumber: string;

  @IsString()
  title: string;

  @IsObject()
  // @ValidateNested()
  name: Names;
}

class Service {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  cost: number;

  @IsString()
  icon: string;

  @IsNumber()
  availablePlans: number;
}

class Plan {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  plan: string;

  @IsOptional()
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsArray()
  points: string[];
}

export class DeliveryPlan {
  @IsString()
  id: string;

  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  deliveryDate: string;

  @IsNumber()
  planSchedule: number;

  @IsNumber()
  cost: number;

  @IsString()
  @IsOptional()
  expressService: string; // greater than two days
}

export class PlaceOrderDto {
  // @IsArray()
  @IsObject()
  @ValidateNested()
  @Type(() => BillingAddress)
  billingAddress: BillingAddress;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => OptionalService)
  optionalServices: OptionalService[];

  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  manuscriptFile: ManuscriptFile[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  supportingDocuments: ManuscriptFile[];

  @IsArray()
  omissionSections: string[];

  @IsOptional()
  @IsString()
  omissionOtherSpecified: string;

  @IsOptional()
  @IsObject()
  feature: IFeatures;

  @IsString()
  omissionOther: string;

  @IsString()
  academicField: string;

  @IsString()
  specialty: string;

  @IsOptional()
  @IsArray()
  editingPreferences: string[];

  @IsOptional()
  @IsArray()
  addOnServices: string[];

  @IsOptional()
  @IsString()
  documentType: string;

  @IsOptional()
  @IsString()
  deliveryDate: string;

  @IsString()
  manuscriptPurpose: string;

  @IsString()
  manuscriptType: string;

  @IsString()
  journalTitle: string;

  @IsString()
  specialRequest: string;

  @IsNumber()
  totalServiceCost: number;

  // @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInformation)
  personalInformation: PersonalInformation;

  @IsObject()
  @Type(() => Service)
  service: Service;

  @IsObject()
  @ValidateNested()
  @Type(() => Plan)
  plan: Plan;

  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryPlan)
  deliveryPlan: DeliveryPlan;

  @IsString()
  editEntireDocument: string;

  @IsNumber()
  wordCount: number;

  @IsString()
  wordReduction20Percent: string;

  @IsString()
  language: string;
}
