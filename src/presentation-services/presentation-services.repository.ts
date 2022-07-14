import { EntityRepository, Repository } from 'typeorm';
import { PresentationService } from './presentation-services.entity';

@EntityRepository(PresentationService)
export class PresentationServiceRepository extends Repository<PresentationService> {}
