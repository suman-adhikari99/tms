import { IsOptional, IsString } from 'class-validator';

export interface IServicePackage {
  planId?: string;
}

export interface IOrderStatus {
  date: string;
  status: string;
  followUpMessage: string;
  remarks: string;
}

export interface IStatus {
  date: string;
  mainStatus: string;
  subStatus: string;
  description: string;
}
export class Status implements IStatus {
  @IsString()
  @IsOptional()
  mainStatus: string;

  @IsString()
  @IsOptional()
  subStatus: string;

  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  description: string;
}

export interface IFeatures {
  id: string;
  title: string;
  content: string;
  price: string;
}
export class Features implements IFeatures {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  price: string;
}

export interface IOptionalService {
  id: string;
  name: string;
  price: string;
  discount: string;
}

export interface IManuscript {
  // id: string;
  s3FullPath: string;
  metaData: {
    filename: string;
    fileType: string;
    size: string;
  };
}

export interface IServicePreferences {
  entireDocument: boolean;
  wordCount: number;
  deliveryPlanId: number;
  optionalServices: Array<IOptionalService>;
  manuscriptFile: Array<IManuscript>;
  editableSections: Array<string>;
  wordReduction20Percent: boolean;
  academicField: string;
  specialty: Array<string>;
  addOnServices: Array<string>;
  manuscriptPurpose: string;
  manuScriptType: string;
  journalTitle: string;
  formatManuscript: boolean;
  language: string;
  specialRequest: string;
}

export interface IOrderFeedback {
  rating: number;
  feedbackMessage: string;
}