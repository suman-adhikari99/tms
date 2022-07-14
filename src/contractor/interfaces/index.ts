import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export interface IPaymentSpec {
  highPriorityPay: string;
  mediumPriorityPay: string;
  lowPriorityPay: string;
  taskSettingName: string;
}

export class PaymentSpec implements IPaymentSpec {
  @IsOptional()
  @IsString()
  highPriorityPay: string;

  @IsOptional()
  @IsString()
  mediumPriorityPay: string;

  @IsOptional()
  @IsString()
  lowPriorityPay: string;

  @IsString()
  taskSettingName: string;
}
