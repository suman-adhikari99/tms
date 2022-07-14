import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IFiles } from '../interfaces';

export class Roles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}
export class OrderMessageDto {
  @IsString()
  name: string;

  @IsString()
  fullName: string;

  @IsString()
  activeRole: string;

  @IsString()
  image: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Roles)
  role: Roles;

  @IsString()
  message: string;

  @IsString()
  date: string;

  @IsString()
  channel: string;

  @IsString()
  creator: string;

  @IsArray()
  seen: string[];

  @IsString()
  user: string;

  @IsOptional()
  @IsArray()
  files: Array<IFiles>;
}
