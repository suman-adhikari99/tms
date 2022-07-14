import { Body, Controller, Post } from '@nestjs/common';
import { PlaceOrderDto } from './dto/place-order.dto';
import { GuestService } from './guest.service';

@Controller('guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Post('/order')
  createOrder(@Body() order: PlaceOrderDto) {
    return this.guestService.createOrder(order);
  }
}
