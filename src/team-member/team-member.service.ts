import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { getObjectId } from 'src/utilities';
import { AddTeamMemberDto } from './dto/team-member.dto';
import { TeamMemberRepository } from './team-member.repository';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMemberRepository)
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly projectRepository: ProjectManagement,
  ) {}

  async addTeamMember(team: AddTeamMemberDto) {
    try {
      const { teamMember } = team;
      console.log(teamMember);
      // find project id from project repository
      // objectId
      const objectId = getObjectId(teamMember);
      const project = await this.projectRepository.findOne(objectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      } else {
        // update project
        teamMember;
        const updateProject = await this.projectRepository.update(
          objectId,
          team,
        );
        console.log(updateProject);
        // return await this.projectRepository.save(updateProject);
      }
      // const member = await this.teamMemberRepository.create({
      //   ...teamMember,
      //   projectId: teamMember.projectId,
      //   userId: teamMember.id.toString(),
      //   name: teamMember.name,
      //   imageUrl: teamMember.imageUrl,
      //   role: teamMember.role,
      //   joinedDate: new Date().toISOString(),
      //   isJoined: false,
      // });

      // return await this.teamMemberRepository.save(member), 'Team member added';
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async getAllTeamMembers() {
    return await this.teamMemberRepository.find();
  }

  async getTeamMemberById(id: string) {
    try {
      const objectId = getObjectId(id);
      const member = await this.teamMemberRepository.findOne(objectId);
      if (!member) {
        throw new NotFoundException('Team member not found');
      } else {
        return member;
      }
    } catch (err) {
      throw new NotFoundException('Team member not found catched');
    }
  }

  async getTeamMemberByProjectId(projectId: string) {
    try {
      const members = await this.teamMemberRepository.find({
        where: {
          projectId: projectId,
        },
      });
      if (!members) {
        throw new NotFoundException('Members not found.');
      } else {
        return members;
      }
    } catch (err) {
      throw new NotFoundException('Team member not found.');
    }
  }
}

// async addTeamMember(teamMember: AddTeamMemberDto) {
//   try {
//     const member = await this.teamMemberRepository.create({
//       ...teamMember,
//       projectId: teamMember.projectId,
//       userId: teamMember.id.toString(),
//       name: teamMember.name,
//       imageUrl: teamMember.imageUrl,
//       role: teamMember.role,
//       joinedDate: new Date().toISOString(),
//       isJoined: false,
//     });

//     return await this.teamMemberRepository.save(member), 'Team member added';
//   } catch (err) {
//     throw new NotFoundException(err);
//   }
// }
