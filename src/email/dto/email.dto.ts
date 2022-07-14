import { IsBoolean, IsOptional } from 'class-validator';

export class EmailDto {
  @IsOptional()
  @IsBoolean()
  isArchived: boolean;
}
