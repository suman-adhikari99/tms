import { EntityRepository, MongoRepository } from 'typeorm';
import { Payroll } from './payroll.entity';

@EntityRepository(Payroll)
export class PayrollRepository extends MongoRepository<Payroll> {}
