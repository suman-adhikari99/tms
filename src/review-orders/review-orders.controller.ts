import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { EditReviewOrderDto } from './dto/edit-review-order.dto';
import { FileDto } from './dto/file-dto';
import { ReviewOrderDto } from './dto/review-orders-dto';
import { ReviewOrdersService } from './review-orders.service';

@Controller('review-order')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ReviewOrdersController {
  constructor(private readonly reviewOrdersService: ReviewOrdersService) {}

  @Post('/new')
  newReview(
    @Body() reviewOrder: EditReviewOrderDto,
    @CurrentUser() reviewBy: User,
  ) {
    return this.reviewOrdersService.createNewReviewOrder(reviewOrder, reviewBy);
  }

  @Get('/profile/:pid')
  groupedOrderAndCLients(@Param('pid') pid: string) {
    return this.reviewOrdersService.getProfileByUserId(pid);
  }

  @Get('/users/:uid')
  getOrderByUserId(@Param('uid') uid: string) {
    return this.reviewOrdersService.getOrderByUserId(uid);
  }

  @Get('/clientInvoices/:uid')
  getClientsInvoices(@Param('uid') uid: string) {
    return this.reviewOrdersService.getInvoicesByClientId(uid);
  }

  // get invoices who is logged in
  @Get('/myInvoice')
  getMyInvoices(@CurrentUser() user: User) {
    return this.reviewOrdersService.getMyInvoices(user);
  }

  @Get('/users')
  listAllUsers() {
    return this.reviewOrdersService.getAllClientUsers();
  }

  @Put('/generateInvoice/:id')
  generateInvoice(@Param('id') id: string, @Body() fileDto: FileDto) {
    return this.reviewOrdersService.generateInvoice(id, fileDto);
  }

  @Put('/paid/:id')
  markAsPaid(@Param('id') id: string) {
    return this.reviewOrdersService.markAsPaid(id);
  }

  @Get('/quotations')
  getLatestQuotations() {
    return this.reviewOrdersService.getLatestQuotations();
  }

  @Get('/relatedQuotations/:orderId')
  getQuotationsByOrderId(@Param('orderId') orderId: string) {
    return this.reviewOrdersService.getQuotationsByOrderId(orderId);
  }

  @Get('/invoice') // review order that exists invoice
  latestReviewOrder() {
    return this.reviewOrdersService.getLatestReviewOrders();
  }

  @Get('/ro') // not having not approved
  getNotApprovesReviewOrder() {
    return this.reviewOrdersService.getNotApprovedReviewOrders();
  }

  @Get('/:id')
  getReviewOrderById(@Param('id') id: string) {
    return this.reviewOrdersService.getReviewOrderById(id);
  }

  @Put('/accept/:id')
  accept(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException('You are not authorized');
    return this.reviewOrdersService.acceptOrder(id, user);
  }

  @Get('/userInvoice/:uid')
  getUserInvoice(@Param('uid') uid: string) {
    return this.reviewOrdersService.getUserByInvoice(uid);
  }

  @Get()
  getAllReviewOrders() {
    return this.reviewOrdersService.getAllReviewOrders();
  }
}

// @Post()
// placeOrder(@Body() reviewOrder: ReviewOrderDto) {
//   return this.reviewOrdersService.createReviewOrder(reviewOrder);
// }
