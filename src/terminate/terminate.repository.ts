import { EntityRepository, Repository } from 'typeorm';
import { Terminate } from './terminate.entity';
@EntityRepository(Terminate)
export class TerminateRepository extends Repository<Terminate> {}
