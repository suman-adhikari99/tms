import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested, IsOptional } from 'class-validator';

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

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  assistanceRequestId: string;

  @IsOptional()
  @IsString()
  folderName: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  manuscriptFile: ManuscriptFile[];
}
