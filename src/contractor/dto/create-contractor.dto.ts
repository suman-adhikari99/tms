import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PaymentSpec {
  @IsString()
  highPriorityPay: string;

  @IsString()
  mediumPriorityPay: string;

  @IsString()
  lowPriorityPay: string;

  @IsString()
  taskSettingName: string;
}

export class CreateContractorDto {
  @IsString()
  groupName: string;

  @IsArray()
  @ValidateNested()
  @Type(() => PaymentSpec)
  paymentSpec: PaymentSpec[];
}
