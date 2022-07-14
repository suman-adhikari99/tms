import { EntityRepository, Repository } from 'typeorm';
import { Contractor } from 'src/contractor/entities/contractor.entity';

@EntityRepository(Contractor)
export class ContractorRepository extends Repository<Contractor> {}
