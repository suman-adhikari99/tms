import { EntityRepository, Repository } from 'typeorm';
import { TeamMember } from './team-member.entity';

@EntityRepository(TeamMember)
export class TeamMemberRepository extends Repository<TeamMember> {}
