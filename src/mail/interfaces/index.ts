import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export interface IFile {
  fileId: string;
  fileName: string;
  filePath: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedTime: string;
}

export class File implements IFile {
  @IsString()
  fileId: string;
  
  @IsString()
  fileName: string;
  
  @IsString()
  filePath: string;
  
  @IsString()
  fileSize: string;
  
  @IsString()
  fileType: string;
  
  @IsString()
  uploadedAt: string;
  
  @IsString()
  uploadedBy: string;
  
  @IsString()
  uploadedTime: string;
}

export interface IMailWithAttachments {
  to: string[];
  from: string;
  subject: string;
  html: string;
  file: IFile[];
}