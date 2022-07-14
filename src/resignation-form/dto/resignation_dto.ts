import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  isObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
// import { ResignationLetter } from '../interfaces';

export class ResignationLetter {
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

export class CreateResignationDto {
  @IsString()
  employee_id: string;

  @IsString()
  dateOfSubmission: string;

  @IsString()
  lastWorkingDay: string;

  @IsString()
  reasonForResignation: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ResignationLetter)
  resignationLetter: ResignationLetter;
}
