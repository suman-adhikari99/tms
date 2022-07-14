import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskSettingsService } from './task-settings.service';
import { CreateTaskSettingDto } from './dto/create-task-setting.dto';
import { UpdateTaskSettingDto } from './dto/update-task-setting.dto';

@Controller('task-settings')
export class TaskSettingsController {
  constructor(private readonly taskSettingsService: TaskSettingsService) {}

  @Post()
  create(@Body() createTaskSettingDto: CreateTaskSettingDto) {
    return this.taskSettingsService.create(createTaskSettingDto);
  }

  @Get()
  findAll() {
    return this.taskSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskSettingsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskSettingDto: UpdateTaskSettingDto,
  ) {
    return this.taskSettingsService.update(id, updateTaskSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskSettingsService.remove(id);
  }
}
