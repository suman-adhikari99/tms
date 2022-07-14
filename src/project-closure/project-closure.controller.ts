import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectClosureService } from './project-closure.service';
import { CreateProjectClosureDto } from './dto/create-project-closure.dto';
import { UpdateProjectClosureDto } from './dto/update-project-closure.dto';

@Controller('project-closure')
export class ProjectClosureController {
  constructor(private readonly projectClosureService: ProjectClosureService) {}

  @Post()
  create(@Body() createProjectClosureDto: CreateProjectClosureDto) {
    return this.projectClosureService.createProjectClosure(
      createProjectClosureDto,
    );
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.projectClosureService.findOneProjectClosure(id);
  }
}
