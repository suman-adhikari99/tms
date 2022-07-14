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
import { AssistanceServicesService } from './assistance-services.service';
import { SaveAssistanceServicesDto } from './dto/save-assistance-services.dto';

@Controller('assistance-services')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AssistanceServicesController {
  constructor(private assistanceService: AssistanceServicesService) {}

  // @Post()
  // saveAssistanceService(
  //   @Body() assistanceServiceDto: SaveAssistanceServicesDto,
  //   @CurrentUser() user: User,
  // ) {
  //   return this.assistanceService.saveAssistanceService(
  //     assistanceServiceDto,
  //     user,
  //   );
  // }

  @Get('/my')
  async myAssistanceServices(@CurrentUser() user: User) {
    return await this.assistanceService.myAssistanceServices(user);
  }

  @Get('/:id')
  getAssistanceRequestById(@Param('id') id: string) {
    return this.assistanceService.getAssistanceServiceById(id);
  }
}
