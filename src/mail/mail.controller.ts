import { Body, Controller, Post } from '@nestjs/common';
import { SendMailDto, SendMailWithAttachmentsDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send-one')
  sendMail(@Body() mailOptions: SendMailDto) {
    return this.mailService.sendMail(mailOptions);
  }

  @Post('/send-email')
  sendMailFromUI(@Body() mailOptions: any) {
    return this.mailService.sendMail(mailOptions);
  }
  
  @Post('/send-email-attachments')
  sendAndSaveMailWithAttachment(@Body() mailOptions: SendMailWithAttachmentsDto) {
    return this.mailService.sendAndSaveMailWithAttachment(mailOptions);
  }

  // @Post('/deliverOrder')
  // sendMailWithAttachment(@Body() mailOptions: SendMailDto) {
  //   return this.mailService.sendMailWithAttachment(mailOptions);
  // }
}
