import { EntityRepository, Repository } from 'typeorm';
import { Deduction } from 'src/deductions/entities/deduction.entity';

@EntityRepository(Deduction)
export class DeductionRepository extends Repository<Deduction> {}
