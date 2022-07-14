import { IsString } from 'class-validator';

export interface IManuscriptFile {
  uploadedBy: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileId: string;
  uploadedAt: string;
  uploadedTime: string;
}

export class ManuscriptFile implements IManuscriptFile {
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

  @IsString()
  uploadedAt: string;

  @IsString()
  uploadedTime: string;
}
