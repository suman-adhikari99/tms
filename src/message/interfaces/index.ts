import { Type } from 'class-transformer';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
export interface IMessages {
  name: string;
  role: string;
  message: string;
  date: string;
  orderId: string;
  files?: Array<IFiles>;
}
export interface IFiles {
  name: string;
  url: string;
}
export interface IRoles {
  mainRoles: string[];
  activeRole: string;
}

export class Roles implements IRoles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}
