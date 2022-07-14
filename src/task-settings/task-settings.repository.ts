import { EntityRepository, Repository } from 'typeorm';

import { TaskSetting } from 'src/task-settings/entities/task-setting.entity';

@EntityRepository(TaskSetting)
export class TaskSettingRepository extends Repository<TaskSetting> {}
