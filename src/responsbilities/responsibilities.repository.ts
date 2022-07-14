import { EntityRepository, Repository } from 'typeorm';
import { Responsibility } from './responsibility.entity';

@EntityRepository(Responsibility)
export class ResponsibilityRepository extends Repository<Responsibility> {}
