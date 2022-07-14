import { EntityRepository, Repository } from 'typeorm';
import { Deliverables } from './deliverables.entity';

@EntityRepository(Deliverables)
export class DeliverablesRepository extends Repository<Deliverables> {}
