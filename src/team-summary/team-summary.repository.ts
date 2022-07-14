import { EntityRepository, Repository } from 'typeorm';
import { TeamSummary } from './team-summary.entity';

@EntityRepository(TeamSummary)
export class TeamSummaryRepositry extends Repository<TeamSummary> {}
