import { IsOptional, IsString } from 'class-validator';

export class EmailDto {
  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  userId: string;
}
