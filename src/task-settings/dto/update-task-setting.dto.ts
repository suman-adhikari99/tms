import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskSettingDto } from './create-task-setting.dto';

export class UpdateTaskSettingDto extends PartialType(CreateTaskSettingDto) {}
