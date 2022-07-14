import { EntityRepository, MongoRepository } from 'typeorm';
import { Email } from './email.entity';

@EntityRepository(Email)
export class EmailRepository extends MongoRepository<Email> {}
