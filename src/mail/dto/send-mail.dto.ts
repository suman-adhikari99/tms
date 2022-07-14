import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { File } from '../interfaces';

export class SendMailDto {
  @IsArray()
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  from: string;

  // @IsOptional()
  // @IsString()
  // fileName: string;

  // @IsOptional()
  // @IsString()
  // attachments: string[];
}

export class SendMailWithAttachmentsDto {
  @IsArray()
  to: string[];

  @IsString()
  from: string;
  
  @IsString()
  subject: string;
  
  @IsString()
  html: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => File)
  file: Array<File>;
}
