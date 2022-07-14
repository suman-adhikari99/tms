import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ClientManagerService } from './client-manager.service';

@Controller('client-manager')
export class ClientManagerController {
  constructor(private clientManagerService: ClientManagerService) {}

  @Post('/deliverOrder/:oId')
  employeeProject(@Param('oId') oId: string, @Body() body: any) {
    console.log('hhhhhhhhhhhhhhhh', body);
    this.clientManagerService.deliverOrder(oId, body);
  }

  @Post('/deliverRequest/:aId')
  deliverRequest(@Param('aId') aId: string, @Body() body: any) {
    return this.clientManagerService.deliverRequest(aId, body);
  }

  @Put('/saveProfile/:userId/:projectId')
  saveProfile(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.clientManagerService.saveProfile(userId, projectId, user);
  }

  @Get('/getSavedProfile/:projectId')
  getSavedProfile(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.clientManagerService.getSavedProfile(projectId, user);
  }

  @Get('/recentTask')
  employeeT(@CurrentUser() user: User) {
    return this.clientManagerService.getRecentTask(user);
  }
}
