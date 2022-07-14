import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface IResignationLetter {
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: string;
  fileId: string;
  uploadedAt: string;
  uploadedTime: string;
  uploadedBy: string;
}

export class ResignationLetter implements IResignationLetter {
  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsString()
  filePath: string;

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

  @IsOptional()
  @IsString()
  uploadedBy: string;
}
