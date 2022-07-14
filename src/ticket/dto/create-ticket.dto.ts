import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  activeRole: string;

  @IsString()
  message: string;

  @IsString()
  bmId: string;

  @IsString()
  cmId: string;

  @IsString()
  orderId: string;
}
