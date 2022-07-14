import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { Day } from '../interfaces';

export class CreateAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Day)
  availableDays: Day[];
}
