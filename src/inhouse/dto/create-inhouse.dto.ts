import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  isObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class CreateInhouseDto {
  @IsString()
  groupName: string;

  @IsString()
  basePayPerHour: string;
}
