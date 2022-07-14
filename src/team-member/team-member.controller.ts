import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AddTeamMemberDto } from './dto/team-member.dto';
import { TeamMemberService } from './team-member.service';

@Controller('team-member')
export class TeamMemberController {
  constructor(private teamMemberService: TeamMemberService) {}

  @Put()
  addTeamMember(@Body() teamMemberDto: AddTeamMemberDto) {
    return this.teamMemberService.addTeamMember(teamMemberDto);
  }

  @Get('/:id')
  getTeamMemberByProjectId(@Param('id') id: string) {
    return this.teamMemberService.getTeamMemberByProjectId(id);
  }

  // @Get('/:id')
  // getTeamMemberById(@Param('id') id: string) {
  //   return this.teamMemberService.getTeamMemberById(id);
  // }

  @Get()
  getAllTeamMembers() {
    return this.teamMemberService.getAllTeamMembers();
  }
}
