import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateProjectDto } from './dto/create-project-dto';
import { EditProjectDto } from './dto/edit-project-dto';
import { ProjectManagementService } from './project-management.service';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { Request } from 'express';

@Controller('projects')
export class ProjectManagementController {
  constructor(private projectService: ProjectManagementService) {}

  @Get('/project/:userId')
  getProject(@Param('userId') userId: string) {
    return this.projectService.getProject(userId);
  }

  @Get('/task/:userId')
  getTask(@Param('userId') userId: string) {
    return this.projectService.getTask(userId);
  }

  @Get('/my')
  getMyProjects(@CurrentUser() user: User) {
    return this.projectService.getMyProjects(user);
  }

  @Get('/getJoinRequestForCE')
  getJoinRequestForCE(@CurrentUser() user: User) {
    return this.projectService.getJoinRequestForCE(user);
  }

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.createProject(createProjectDto, user);
  }

  @Put('/requestToParticipate/:projectId')
  requestToParticipate(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.requestToParticipate(projectId, user);
  }

  @Put('/teamMember/:pid')
  addTeamMember(
    @Body() editProject: EditProjectDto,
    @Param('pid') pid: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.addTeamMember(editProject, pid, user);
  }

  @Put('/activeDoc/:pid')
  addActiveDocument(
    @Body() editProject: EditProjectDto,
    @Param('pid') pid: string,
  ) {
    return this.projectService.addActiveDocument(editProject, pid);
  }

  @Put('/supportingDoc/:pid')
  addSupportingDocument(
    @Body() editProject: EditProjectDto,
    @Param('pid') pid: string,
  ) {
    return this.projectService.addSupportingDocument(editProject, pid);
  }

  // @Put('/remove/:pid')
  // removeMember(@Body() editProject: EditProjectDto, @Param('pid') pid: string) {
  //   return this.projectService.removeMember(editProject, pid);
  // }

  @Delete('/remove/:pid/:index')
  removeMember(@Param('pid') pid: string, @Param('index') index: number) {
    return this.projectService.removeMember(pid, index);
  }

  @Put('/:id')
  editProject(@Body() editProjectDto: EditProjectDto, @Param('id') id: string) {
    return this.projectService.editProject(editProjectDto, id);
  }

  @Put('/reject/:projectId')
  rejectthisProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.rejectthisProject(projectId, user);
  }

  @Put('/accept/:projectId')
  acceptthisProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.acceptthisProject(projectId, user);
  }

  @Get('/open')
  getOpenAndNewProjects(@CurrentUser() user: User) {
    return this.projectService.getOpenAndNewProjects(user);
  }

  @Get()
  getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Get('/:id')
  getProjectById(@Param('id') id: string, @Req() request: Request) {
    return this.projectService.getProjectById(id, request);
  }

  @Get('/memberProject/:id')
  getProjectByTeamMemberId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectService.getProjectByTeamMemberId(id, user);
  }

  @Put('/acceptJoinRequest/:projectId/:userid')
  acceptJoinRequest(
    @Param('projectId') projectId: string,
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.acceptJoinRequest(projectId, userid, user);
  }

  //  @Put('/acceptJoinRequest')
  //   acceptJoinRequest(

  //     @Query('projectId') projectId: string,
  //     @Query('userid') userid: string,
  //     )
  //      {
  //     return this.projectService.acceptJoinRequest(projectId, userid);}

  @Put('/rejectJoinRequest/:projectId/:userid')
  rejectJoinRequest(
    @Param('projectId') projectId: string,
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.rejectJoinRequest(projectId, userid, user);
  }
}
