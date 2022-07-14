import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  ValidateNested,
  IsOptional,
  IsObject,
} from 'class-validator';
export class ManuscriptFile {
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

  @IsString()
  fileId: string;

  @IsOptional()
  @IsString()
  uploadedAt: string;

  @IsOptional()
  @IsString()
  uploadedTime: string;
}
export class CreateProjectClosureDto {
  @IsOptional()
  @IsString()
  orderId: string;

  @IsString()
  projectId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  evaluationCertificate: ManuscriptFile;

  @IsObject()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  editorCertificate: ManuscriptFile;
}
