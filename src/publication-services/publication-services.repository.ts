import { EntityRepository, Repository } from 'typeorm';
import { PublicationServices } from './publication-services.entity';

@EntityRepository(PublicationServices)
export class PublicationSerViceRepository extends Repository<PublicationServices> {}
