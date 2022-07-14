import { EntityRepository, Repository } from 'typeorm';
import { Services } from './services.entity';

@EntityRepository(Services)
export class ServicesRepository extends Repository<Services> {}
