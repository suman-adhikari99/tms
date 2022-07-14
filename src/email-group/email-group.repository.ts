import { EntityRepository, Repository } from 'typeorm';
import { EmailGroup } from './email-group.entity';

@EntityRepository(EmailGroup)
export class EmailGroupRepository extends Repository<EmailGroup> {}
