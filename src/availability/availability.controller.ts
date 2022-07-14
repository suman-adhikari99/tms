import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability';

@Controller('availability')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AvailabilityController {
  constructor(private availabilitySevice: AvailabilityService) {}

  @Post('/set')
  setUserAvailability(
    @Body() availability: CreateAvailabilityDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.availabilitySevice.setUserAvailability(availability, currentUser);
  }

  @Get('/user/:id')
  getUserAvailability(@Param('id') userId: string) {
    return this.availabilitySevice.getUserAvailability(userId);
  }
}
