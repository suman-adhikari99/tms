import { Module } from '@nestjs/common';
import { TeamSummaryController } from './team-summary.controller';
import { TeamSummaryService } from './team-summary.service';

@Module({
  controllers: [TeamSummaryController],
  providers: [TeamSummaryService]
})
export class TeamSummaryModule {}
