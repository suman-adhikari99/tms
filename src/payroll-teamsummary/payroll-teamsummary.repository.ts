import { EntityRepository, Repository } from 'typeorm';
import { PayrollTeamsummary } from './payroll-teamsummary.entity';

@EntityRepository(PayrollTeamsummary)
export class PayrollTeamsummaryRepository extends Repository<PayrollTeamsummary> {}
