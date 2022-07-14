import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class SearchDto {
  @IsString()
  searchWord: string;
}
