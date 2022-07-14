import { EntityRepository, Repository } from 'typeorm';
import { Payroll } from './payroll.entity';

@EntityRepository(Payroll)
export class PayrollRepository extends Repository<Payroll> {}
