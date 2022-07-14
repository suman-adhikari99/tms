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
export class CreateBenefitDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  calculationType: string;

  @IsString()
  amount: string;

  @IsBoolean()
  taxable: boolean;

  @IsOptional()
  @IsString()
  status: string;
}
