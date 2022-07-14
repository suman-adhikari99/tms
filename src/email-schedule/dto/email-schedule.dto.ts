import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { File } from 'src/mail/interfaces';

export class OrderDeliveryEmailScheduleDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsArray()
  @IsNotEmpty()
  to: string[];

  @IsString()
  @IsNotEmpty()
  from: string;
  
  @IsString()
  @IsNotEmpty()
  subject: string;
  
  @IsString()
  @IsNotEmpty()
  html: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => File)
  file: Array<File>;

  @IsDateString()
  scheduledDate: string;
}

export class AssistanceRequestsEmailScheduleDto {
  @IsString()
  @IsNotEmpty()
  assistanceRequestId: string;

  @IsArray()
  @IsNotEmpty()
  to: string[];

  @IsString()
  @IsNotEmpty()
  from: string;
  
  @IsString()
  @IsNotEmpty()
  subject: string;
  
  @IsString()
  @IsNotEmpty()
  html: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => File)
  file: Array<File>;

  @IsDateString()
  scheduledDate: string;
}

export class UpdateOrderDeliveryEmailScheduleDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsDateString()
  scheduledDate: string;
}

export class UpdateAssistanceRequestsEmailScheduleDto {
  @IsString()
  @IsNotEmpty()
  assistanceRequestId: string;

  @IsDateString()
  scheduledDate: string;
}