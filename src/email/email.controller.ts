import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Get,
  NotFoundException,
  UploadedFiles,
  Put,
  Param,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { EmailDto } from './dto/email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/emailInterceptor')
  @UseInterceptors(AnyFilesInterceptor())
  emailInterceptor(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    const envelope = JSON.parse(body.envelope);
    const to = envelope.to;
    const from = body.from;
    const email = {
      to,
      from,
      subject: body.subject,
      content: body.html.toString(),
    };
    return this.emailService.createEmail(files, email);
  }

  @Post('/saveDraft')
  @UseInterceptors(FileInterceptor('attachments'))
  saveDraft(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    return this.emailService.saveDraft(files, body);
  }

  @Put('/makeArchive/:id')
  makeArchive(@Param('id') id: string) {
    return this.emailService.makeArchive(id);
  }

  @Put('/removeArchive/:id')
  removeFromArchive(@Param('id') id: string) {
    return this.emailService.removeFromArchive(id);
  }

  @Get('/getArchivedEmail')
  getArchived(@CurrentUser() user: User) {
    if (!user) throw new NotFoundException('User not found');
    return this.emailService.getArchivedEmail(user);
  }

  @Get('/inbox')
  inbox(@CurrentUser() user: User) {
    if (!user) throw new NotFoundException('User not found');
    return this.emailService.inbox(user.email);
  }

  @Get('/outbox')
  outbox(@CurrentUser() user: User) {
    console.log('uuuuuuuu', user);
    if (!user) throw new NotFoundException('User not found');
    return this.emailService.outbox(user.email);
  }

  @Get('/draft')
  draft(@CurrentUser() user: User) {
    if (!user) throw new NotFoundException('User not found');
    return this.emailService.draft(user.email);
  }
}
