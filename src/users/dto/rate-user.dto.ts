import { IsArray, IsNumber, IsString } from "class-validator";

export class RateUser {
  @IsString()
  userId: string;

  @IsNumber()
  rating: number;

  @IsString()
  feedbackMessage: string;

  @IsArray()
  @IsString({ each: true })
  goodAt: string[];
  
  @IsArray()
  @IsString({ each: true })
  badAt: string[];
}