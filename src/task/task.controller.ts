import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { EditTaskDto } from './dto/edit-task-dto';
import { FindPeopleDto } from './dto/findPeople-dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Put('/teamMember/:tId')
  addTeamMember(
    @Body() editTask: EditTaskDto,
    @Param('tId') tId: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.addTeamMember(editTask, tId, user);
  }

  @Get('/my')
  getMyTasks(@CurrentUser() user: User) {
    return this.taskService.getMyTasks(user);
  }

  @Get('/recentTasks')
  recentTasks(@CurrentUser() user: User) {
    return this.taskService.recentTasks(user);
  }
  @Put('/ceApprove/:taskId')
  ceTaskApproval(@Param('taskId') taskId: string, @CurrentUser() user: User) {
    return this.taskService.ceTaskApproval(taskId, user);
  }

  @Put('/qaApprove/:taskId')
  qaTaskApproval(@Param('taskId') taskId: string, @CurrentUser() user: User) {
    return this.taskService.qaTaskApproval(taskId, user);
  }

  @Put('/cmApprove/:taskId')
  cmTaskApproval(@Param('taskId') taskId: string, @CurrentUser() user: User) {
    return this.taskService.cmTaskApproval(taskId, user);
  }

  @Put('/accept/:taskId')
  acceptthisTask(@Param('taskId') taskId: string, @CurrentUser() user: User) {
    return this.taskService.acceptthisTask(taskId, user);
  }

  @Put('/reject/:taskId')
  rejectthisTask(@Param('taskId') taskId: string, @CurrentUser() user: User) {
    return this.taskService.rejectthisTask(taskId, user);
  }

  @Put('/requestToParticipate/:taskId')
  requestToParticipateForTask(
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.requestToParticipateForTask(taskId, user);
  }

  @Put('/acceptJoinRequest/:taskId/:userid')
  acceptJoinRequestForTask(
    @Param('taskId') taskId: string,
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.acceptJoinRequestForTask(taskId, userid, user);
  }

  @Put('/rejectJoinRequest/:taskId/:userid')
  rejectJoinRequestForTask(
    @Param('taskId') taskId: string,
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.rejectJoinRequestForTask(taskId, userid, user);
  }

  @Put('/comment/:id')
  addComment(
    @Body() editTaskDto: EditTaskDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.createComment(editTaskDto, id, user);
  }

  @Post('/project')
  createTaskForProject(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Post('/assistanceRequest')
  createTaskForAssistanceRequest(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get('/files/:id')
  getDocument(@Param('id') id: string) {
    return this.taskService.getDocument(id);
  }

  @Get('project/:id')
  myTasksFromProjectId(
    @Param('id') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.myTasksFromProjectId(projectId, user);
  }

  @Get('assistance-request/:assistanceRequestId')
  myTasksFromAssistanceId(
    @Param('assistanceRequestId') assistanceRequestId: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.myTasksFromAssistanceRequestId(
      assistanceRequestId,
      user,
    );
  }

  @Get('/exploreTask')
  exploreTask(@CurrentUser() user: User) {
    return this.taskService.exploreTask(user);
  }

  @Put('/inviteToProjectTask')
  inviteToProjectTask(
    @Body() findDto: FindPeopleDto,
    // @Param('projectId') projectId: string,
  ) {
    console.log(findDto);
    return this.taskService.inviteToProjectInFindPeople(findDto);
  }

  // @Put('/doc/:id')
  // addDocument(@Body() editTaskDto: EditTaskDto, @Param('id') id: string) {
  //   return this.taskService.addDocument(editTaskDto, id);
  // }

  @Put('/invitationFromCMToEditor/:taskId/:id')
  invitationFromCMToEditor(
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.invitationFromCMToEditor(taskId, id, user);
  }

  @Put('/deliverable/:id')
  addDeliverable(@Body() editTaskDto: EditTaskDto, @Param('id') id: string) {
    return this.taskService.addDeliverable(editTaskDto, id);
  }

  @Put('/documents/:id')
  addDocuments(@Body() editTaskDto: EditTaskDto, @Param('id') id: string) {
    return this.taskService.addDocument(editTaskDto, id);
  }

  @Put('/editorDeliverable/:id')
  addDeliverableByEditor(
    @Body() editTaskDto: EditTaskDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.addDeliverableByEditor(editTaskDto, id, user);
  }

  @Put('/reUpload/:fileId/:id')
  reUpload(
    @Body() editTaskDto: EditTaskDto,
    @Param('fileId') fileId: string,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.reUpload(editTaskDto, fileId, id, user);
  }

  @Put('/deleteFile/:id/:fileId')
  deleteFile(@Param('id') id: string, @Param('fileId') fileId: string) {
    return this.taskService.deleteDeliverableFiles(id, fileId);
  }

  @Put('/deleteDocument/:id/:fileId')
  deleteDocument(@Param('id') id: string, @Param('fileId') fileId: string) {
    return this.taskService.deleteDocument(id, fileId);
  }

  @Get()
  getAllTasks() {
    return this.taskService.getAllTask();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Put('/completeSubTask/:taskId/:id')
  tickSubTask(@Param('taskId') taskId: string, @Param('id') id: string) {
    return this.taskService.tickSubTask(taskId, id);
  }
  @Put('/completeTask/:taskId')
  tickTask(@Param('taskId') taskId: string) {
    return this.taskService.tickTask(taskId);
  }

  @Get('/project/:projectId')
  getTask(@Param('projectId') projectId: string) {
    return this.taskService.getTaskByProject(projectId);
  }

  @Put('/:id')
  editTask(@Body() editTaskDto: EditTaskDto, @Param('id') id: string) {
    return this.taskService.editTask(editTaskDto, id);
  }
}
