import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { getString } from 'src/utilities';
import { BillingInfoService } from './billing-info.service';
import { SaveBillingInfoDto } from './dto/save-billing-info.dto';
import { UpdateBillingInfoDto } from './dto/update-billing-info.dto';

const logger = new Logger('BillingInfoController');
@Controller('billing-info')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class BillingInfoController {
  constructor(private billingInfoService: BillingInfoService) {}

  @Post()
  saveBillingInfo(
    @Body() billingDetails: SaveBillingInfoDto,
    @CurrentUser() user: User,
  ) {
    return this.billingInfoService.saveBillingInfo(billingDetails, user);
  }

  @Put()
  updateBillingInfo(
    @Body() billingDetails: UpdateBillingInfoDto,
    @CurrentUser() user: User,
  ) {
    return this.billingInfoService.updateBillingInfo(billingDetails, user);
  }

  @Get('/user/:id')
  getBillingInfoByUser(@Param('id') uid: string) {
    logger.log(`Getting billing info for user ${uid}`);
    if (!uid) {
      throw new Error('No id provided');
    }
    return this.billingInfoService.getBillingInfoByUser(uid);
  }

  @Get('/findById/:id')
  getBillingInfoById(@Param('id') id: string) {
    logger.log(`Getting billing info with id ${id}`);
    if (!id) {
      throw new BadRequestException('No id provided');
    }
    return this.billingInfoService.getBillingsInfoById(id);
  }

  @Get()
  getMyBillingInfos(@CurrentUser() user: User) {
    return this.billingInfoService.getBillingInfoByUser(getString(user.id));
  }

  @Delete('/:id')
  deleteBillingInfo(@Param('id') id: string, @CurrentUser() user: User) {
    logger.log(`Deleting billing info with id ${id}`);
    if (!id) {
      throw new BadRequestException('No id provided');
    }
    return this.billingInfoService.deleteBillingInfo(id, user);
  }
}
