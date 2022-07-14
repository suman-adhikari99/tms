import { IsArray, IsString, ValidateNested } from 'class-validator';

export interface IDay {
  date: string;
  times: [string, string][];
  availability: "available" | "unavailable";
  comment: string;
}

export class Day implements IDay {
  @IsString()
  date: string;

  @IsArray()
  // @ValidateNested({ each: true })
  times: [string, string][];

  @IsString()
  availability: 'available' | 'unavailable';

  @IsString()
  comment: string;
}