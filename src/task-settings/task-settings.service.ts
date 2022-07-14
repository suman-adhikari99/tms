import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskSettingDto } from './dto/create-task-setting.dto';
import { UpdateTaskSettingDto } from './dto/update-task-setting.dto';
import { TaskSettingRepository } from 'src/task-settings/task-settings.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { getObjectId } from 'src/utilities';
@Injectable()
export class TaskSettingsService {
  constructor(
    @InjectRepository(TaskSettingRepository)
    private taskSettingRepository: TaskSettingRepository,
  ) {}

  async create(createTaskSettingDto: CreateTaskSettingDto) {
    try {
      let taskSettings = await this.taskSettingRepository.create(
        createTaskSettingDto,
      );
      return this.taskSettingRepository.save(taskSettings);
    } catch {
      throw new NotFoundException('Some error occured');
    }
  }

  async findAll() {
    try {
      const taskSettings = await this.taskSettingRepository.find();
      return taskSettings;
    } catch (err) {
      throw new NotFoundException('tasksetting not found');
    }
  }

  async findOne(id: string) {
    try {
      let realId = getObjectId(id);

      let taskSetting = await this.taskSettingRepository.findOne(realId);
      return taskSetting;
    } catch (err) {
      throw new NotFoundException('tasksetting not found');
    }
  }

  async update(id: string, updateTaskSettingDto: UpdateTaskSettingDto) {
    try {
      let realId = getObjectId(id);

      let taskSetting = await this.taskSettingRepository.findOne(realId);
      taskSetting = {
        ...taskSetting,
        ...updateTaskSettingDto,
      };
      return this.taskSettingRepository.save(taskSetting);
    } catch (err) {
      throw new NotFoundException('tasksetting not found');
    }
  }

  async remove(id: string) {
    try {
      let realId = getObjectId(id);

      let taskSetting = await this.taskSettingRepository.findOne(realId);

      this.taskSettingRepository.delete(taskSetting);
    } catch (err) {
      throw new NotFoundException('tasksetting not found');
    }
  }
}
