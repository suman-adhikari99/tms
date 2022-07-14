import { Module } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamMemberController } from './team-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './team-member.entity';
import { TeamMemberRepository } from './team-member.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamMemberRepository, ProjectManagement]),
  ],
  providers: [TeamMemberService],
  controllers: [TeamMemberController],
})
export class TeamMemberModule {}
