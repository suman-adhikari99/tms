import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EditReviewOrderDto {
  @IsString()
  @IsOptional()
  orderId: string;

  @IsString()
  @IsOptional()
  billingManagerId: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsOptional()
  @IsString()
  quotationNumber: string;

  @IsOptional()
  @IsString()
  documentLanguage: string;

  @IsOptional()
  @IsString()
  authorName: string;

  @IsOptional()
  @IsNumber()
  documentWordCount: number;

  @IsOptional()
  @IsString()
  specialRequest: string;

  @IsOptional()
  @IsString()
  supportDocTitle: string;

  @IsOptional()
  @IsArray()
  sections: Array<{
    title: string;
    words: number;
  }>;

  @IsOptional()
  @IsArray()
  omitSections: string[];

  @IsOptional()
  @IsArray()
  optionalAdditionalServices: Array<{
    id: string;
    serviceId: string;
    name: string;
    price: number;
    discountPercent: 20;
  }>;

  @IsOptional()
  @IsString()
  manuscriptOption: string;

  @IsOptional()
  @IsString()
  journalURL: string;

  @IsOptional()
  @IsString()
  manuscriptPurposeNotes: string;

  @IsOptional()
  @IsString()
  academicField: string;

  @IsOptional()
  @IsString()
  manuscriptPurposeOption: boolean;

  @IsOptional()
  @IsString()
  speciality: string;

  @IsOptional()
  @IsObject()
  deliveryPlan: {
    id: string;
    serviceId: string;
    planSchedule: number;
    cost: number;
  };

  @IsOptional()
  @IsObject()
  billingAddressReview: {
    id: string;
    title: string;
    billingType: string;
    organizationName: string;
    departmentName: string;
    invoiceAddress: string;
    postalCode: string;
    region: string;
    userId: string;
    default: boolean;
  };

  @IsOptional()
  @IsArray()
  billInfoTags: Array<{
    id: string;
    value: string;
  }>;

  @IsOptional()
  @IsString()
  billingInfoNotes: string;
}
