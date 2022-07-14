import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { EmailGroupDto } from './dto/create-email-group.dto';
import { UpdateEmailGroupDto } from './dto/update-email-group.dto';
import { EmailGroupService } from './email-group.service';

@Controller('email-group')
export class EmailGroupController {
  constructor(private emailGroupService: EmailGroupService) {}

  @Post()
  makeEmailTemplate(
    @Body() emailDto: EmailGroupDto,
    @CurrentUser() user: User,
  ) {
    return this.emailGroupService.makeEmailGroup(emailDto, user);
  }

  @Put('/:id')
  updateTemplate(
    @Param('id') id: string,
    @Body() updateDto: UpdateEmailGroupDto,
  ) {
    return this.emailGroupService.updateEmailGroup(id, updateDto);
  }

  @Get()
  getMyEmailGroup(@CurrentUser() user: User) {
    return this.emailGroupService.getEmailGroup(user);
  }

  @Put('/:groupId/:userId')
  removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.emailGroupService.removeMemberFromGroup(groupId, userId);
  }

  // dsf
  @Delete('/:id')
  deleteEmailGroup(@Param('id') id: string) {
    return this.emailGroupService.deleteEmailGroup(id);
  }
}
