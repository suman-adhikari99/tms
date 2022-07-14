import { IsObject, IsOptional, IsString } from 'class-validator';

export class ManuscriptFile {
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

  @IsString()
  userId: string;

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

export class FileDto {
  @IsObject()
  file: ManuscriptFile;
}
