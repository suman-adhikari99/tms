import { EntityRepository, Repository } from 'typeorm';
import { PlanOption } from './plan-option.entity';

@EntityRepository(PlanOption)
export class PlanOptionRepository extends Repository<PlanOption> {}
