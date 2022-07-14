import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateProjectDto } from 'src/projects/dto/create-project-dto';
import { User } from 'src/users/user.entity';
import { ProjectReopenDto } from './dto/create-project-reopen.dto';
import { ProjectReopenService } from './project-reopen.service';

@Controller('project-reopen')
export class ProjectReopenController {
  constructor(private projectReopenService: ProjectReopenService) {}

  @Post()
  createProject(
    @Body() projectReopenDto: ProjectReopenDto,
    @CurrentUser() user: User,
  ) {
    return this.projectReopenService.createProject(projectReopenDto, user);
  }

  @Put('/reopen/:projectId')
  projectReopen1(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectReopenService.projectReOpen1(projectId, user);
  }

  @Get('/project/:projectId')
  getReopenedProject(@Param('projectId') projectId: string) {
    return this.projectReopenService.getReopenedProject(projectId);
  }
}
