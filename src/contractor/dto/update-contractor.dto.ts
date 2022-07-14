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

export class PaymentSpec {
  @IsOptional()
  @IsString()
  taskSettingName: string;

  @IsOptional()
  @IsString()
  highPriorityPay: string;

  @IsOptional()
  @IsString()
  mediumPriorityPay: string;

  @IsOptional()
  @IsString()
  lowPriorityPay: string;
}

export class UpdateContractorDto {
  @IsOptional()
  @IsString()
  groupname: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => PaymentSpec)
  paymentSpec: PaymentSpec[];
}
