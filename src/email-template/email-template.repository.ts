import { EntityRepository, Repository } from 'typeorm';
import { EmailTemplate } from './email-template.entity';

@EntityRepository(EmailTemplate)
export class EmailTemplateRepository extends Repository<EmailTemplate> {}
