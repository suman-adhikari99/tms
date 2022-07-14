import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditingServicesRepository } from 'src/editing-services/editing-services.repository';
import { User } from 'src/users/user.entity';
import { getObjectId } from 'src/utilities';
import { EmailDto } from './dto/make-template.dto';
import { UpdateEmailDto } from './dto/update-template.dto';
import { EmailTemplateRepository } from './email-template.repository';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplateRepository)
    private emailTemplateRepository: EmailTemplateRepository,
  ) {}

  async makeEmailTemplate(emailDto: EmailDto, user: User) {
    const { subject, content } = emailDto;
    const emailTemplate = await this.emailTemplateRepository.create({
      userId: user.id.toString(),
      subject,
      content,
      createdDate: new Date().toISOString(),
    });
    return this.emailTemplateRepository.save(emailTemplate);
  }

  //get myemail templates
  async getMyEmailTemplates(user: User) {
    return await this.emailTemplateRepository.find({
      where: { userId: user.id.toString() },
    });
  }

  async updateTemplate(id: string, updateDto: UpdateEmailDto) {
    const objectId = getObjectId(id);
    const emailTemplate = await this.emailTemplateRepository.findOne(objectId);
    if (!emailTemplate) {
      throw new NotFoundException(`Email Template not found`);
    } else {
      const { subject, content } = updateDto;
      emailTemplate.subject = subject;
      emailTemplate.content = content;
      return await this.emailTemplateRepository.save(emailTemplate);
    }
  }

  async deleteTemplate(id: string) {
    const objectId = getObjectId(id);
    const emailTemplate = await this.emailTemplateRepository.findOne(objectId);
    if (!emailTemplate) {
      throw new NotFoundException(`Email Template not found`);
    } else {
      return await this.emailTemplateRepository.delete(objectId);
    }
  }
}
