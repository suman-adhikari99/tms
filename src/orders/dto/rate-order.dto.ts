import { IsNumber, IsString } from "class-validator";

export class RateOrder {
  @IsString()
  orderId: string;

  @IsNumber()
  rating: number;

  @IsString()
  feedbackMessage: string;
}