import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { PlaceOrderDto } from './dto/place-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { OrdersService } from './orders.service';
import { Request } from 'express';
import { EditOrderDto } from './dto/edit-order.dto';
import { RateOrder } from './dto/rate-order.dto';

@Controller('orders')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  //ask from service via dependency injection
  constructor(private ordersService: OrdersService) {}

  @Get('/myOrders')
  myOrders(@CurrentUser() user: User, @Req() request: Request) {
    return this.ordersService.myOrders(user, request);
  }

  @Post()
  placeOrder(@Body() order: PlaceOrderDto, @CurrentUser() user: User) {
    return this.ordersService.placeOrder(order, user);
  }

  @Put('/manuscriptFile/:oId')
  addActiveDocument(
    @Body() editOrder: EditOrderDto,
    @Param('oId') oId: string,
  ) {
    return this.ordersService.addManuscript(editOrder, oId);
  }

  @Put('/supportingDocument/:oId')
  addSupportingDocument(
    @Body() editOrder: EditOrderDto,
    @Param('oId') oId: string,
  ) {
    return this.ordersService.addSupportingDocument(editOrder, oId);
  }

  @Get('/all')
  getOrders(@Query() searchOrderDto: SearchOrderDto, @Req() request: Request) {
    return this.ordersService.getOrders(searchOrderDto, request);
  }

  @Get('/myDeliveredOrder')
  getMyDeliveredOrder(@CurrentUser() user: User) {
    return this.ordersService.getMyDeliveredOrder(user);
  }

  @Get()
  ordersDetailByFilter(
    @Query() searchOrderDto: SearchOrderDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.ordersDetailsByFilter(searchOrderDto, user);
  }

  @Get('/:id')
  getOrderById(@Param('id') oid: string) {
    return this.ordersService.getOrderById(oid);
  }

  @Post('/rate')
  rateOrder(@Body() feedback: RateOrder, @CurrentUser() currentUser: User) {
    return this.ordersService.rateOrder(feedback, currentUser);
  }

  @Put('/cancelOrder/:oId')
  @UseGuards(AuthGuard)
  cancelOrder(@Param('oId') oId: string, @CurrentUser() user: User) {
    return this.ordersService.cancelOrder(oId, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  editOrder(
    @Body() editOrderDto: EditOrderDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.editOrder(editOrderDto, id, user);
  }
}
