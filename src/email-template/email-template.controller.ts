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
import { EmailDto } from './dto/make-template.dto';
import { EmailTemplateService } from './email-template.service';

@Controller('email-template')
export class EmailTemplateController {
  constructor(private emailTemplateService: EmailTemplateService) {}

  //   done
  @Post()
  makeEmailTemplate(@Body() emailDto: EmailDto, @CurrentUser() user: User) {
    return this.emailTemplateService.makeEmailTemplate(emailDto, user);
  }

  @Put('/:id')
  updateTemplate(@Param('id') id: string, @Body() updateDto: EmailDto) {
    return this.emailTemplateService.updateTemplate(id, updateDto);
  }

  @Get()
  getMyEmailTemplate(@CurrentUser() user: User) {
    return this.emailTemplateService.getMyEmailTemplates(user);
  }

  @Delete('/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.emailTemplateService.deleteTemplate(id);
  }
}
