import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { DeliverablesService } from './deliverables.service';
import { PlaceDeliverablesDto } from './dto/place-deliverables.dto';

@Controller('deliverables')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DeliverablesController {
  constructor(private deliverablesService: DeliverablesService) {}

  @Post('/placeDeliverables')
  placeDeliverables(
    @Body() deliverables: PlaceDeliverablesDto,
    @CurrentUser() user: User,
  ) {
    return this.deliverablesService.placeDeliverables(deliverables, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllDeliverables() {
    return this.deliverablesService.getAllDeliverables();
  }
}
