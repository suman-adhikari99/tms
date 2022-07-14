import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { MailDataRequired } from '@sendgrid/mail';
import * as sgMail from '@sendgrid/mail';
import { EmailRepository } from 'src/email/email.repository';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { SendMailWithAttachmentsDto } from './dto/send-mail.dto';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Options = PartialBy<MailDataRequired, 'from'>;

@Injectable()
export class MailService {
  constructor(
    private s3service: S3UploaderService,
    private emailRepository: EmailRepository,
  ) {}

  async sendMail(options: Options) {
    try {
      console.log(
        'options >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',
        options.from,
      );

      const mail = {
        from: options.from ? options.from : 'admin@email.axiossoftworks.com',
        ...options,
      } as MailDataRequired;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
      await sgMail.send(mail).catch((err) => {
        //i'm throwing native Error instead of Nest One to let devs know what's wrong exactly
        throw new Error(err);
      });
      
      return {
        message: 'mail send successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'failed to send mail',
      );
    }
  }

  async sendMailWithAttachment(options: Options, fileName, filePath) {
    try {
      if (!(fileName || filePath)) {
        this.sendMail(options);
        return;
      } else {
        const content = await this.s3service.downloadAsStream(
          'edfluent-tms',
          filePath,
          // '629c2d1b467732ea0c46b3d4/20220606/Invoice# 629c8e6f933aae418cd2af9d.pdf', // dynamic
        );

        const mail = {
          ...options,
          from: options.from ? options.from : 'admin@email.axiossoftworks.com',
          attachments: [
            {
              filename: fileName, //  dynamic file name
              content: content,
              type: 'application/pdf',
              disposition: 'attachment',
            },
          ],
        } as MailDataRequired;

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.send(mail).catch((err) => {
          //i'm throwing native Error instead of Nest One to let devs know what's wrong exactly
          throw new Error(err);
        });

        return {
          message: 'mail send successfully',
        };
      }
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'failed to send mail',
      );
    }
  }

  async sendAndSaveMailWithAttachment(mailOptions: SendMailWithAttachmentsDto) {
    const email = {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      content: mailOptions.html,
      attachments: mailOptions.file,
    };

    try {
      const attachmentContents = [];

      for (let attachment of email.attachments) {
        let filePath = decodeURIComponent(attachment.filePath);
        filePath = filePath.slice(filePath.indexOf('/', 10) + 1);

        const content = await this.s3service.downloadAsStream(
          'edfluent-tms',
          filePath,
          // '629c2d1b467732ea0c46b3d4/20220606/Invoice# 629c8e6f933aae418cd2af9d.pdf'
        );

        attachmentContents.push({
          filename: decodeURIComponent(attachment.fileName),
          content: content,
          type: 'application/pdf',
          disposition: 'attachment',
        });
      }

      const options = {
        to: email.to,
        from: email.from,
        subject: email.subject,
        html: email.content,
      } as Options;

      const mail = {
        ...options,
        from: options.from ? options.from : 'admin@email.axiossoftworks.com',
        attachments: attachmentContents,
      } as MailDataRequired;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      await sgMail
        .send(mail)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => {
          throw new Error(err);
        });

      const _email = this.emailRepository.create({
        ...email,
        createdDate: new Date().toISOString(),
      });
      return this.emailRepository.save(_email);
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'failed to send mail',
      );
    }
  }
  
  async sendMailWithAttachment_2(mailOptions: SendMailWithAttachmentsDto) {
    const email = {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      content: mailOptions.html,
      attachments: mailOptions.file,
    };

    try {
      const attachmentContents = [];

      for (let attachment of email.attachments) {
        let filePath = decodeURIComponent(attachment.filePath);
        filePath = filePath.slice(filePath.indexOf('/', 10) + 1);

        const content = await this.s3service.downloadAsStream(
          'edfluent-tms',
          filePath,
          // '629c2d1b467732ea0c46b3d4/20220606/Invoice# 629c8e6f933aae418cd2af9d.pdf'
        );

        attachmentContents.push({
          filename: decodeURIComponent(attachment.fileName),
          content: content,
          type: 'application/pdf',
          disposition: 'attachment',
        });
      }

      const options = {
        to: email.to,
        from: email.from,
        subject: email.subject,
        html: email.content,
      } as Options;

      const mail = {
        ...options,
        from: options.from ? options.from : 'admin@email.axiossoftworks.com',
        attachments: attachmentContents,
      } as MailDataRequired;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      await sgMail
        .send(mail)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'failed to send mail',
      );
    }
  }
}
