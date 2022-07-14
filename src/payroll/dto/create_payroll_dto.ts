import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class PayRollDto {
  @IsArray()
  projectValidity: string[];

  @IsString()
  payRollDate: string;
}
