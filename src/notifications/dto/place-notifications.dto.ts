import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PlaceNotificationsDto {
  @IsString()
  @IsOptional()
  orderTitle: string;

  @IsString()
  @IsOptional()
  orderId: string;

  @IsString()
  @IsOptional()
  clientId: string;

  @IsString()
  @IsOptional()
  status: Array<{
    date: string;
    status: string;
    description: string;
    subStatus: string;
  }>;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  projectId: string;
  @IsString()
  @IsOptional()
  taskId: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsNumber()
  @IsOptional()
  newNotification: number;

  @IsBoolean()
  @IsOptional()
  hasRead: boolean;
}

// @IsArray()
//   @IsOptional()
//   orderStatus: string[];
