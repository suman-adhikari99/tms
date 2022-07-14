import { EntityRepository, MongoRepository, Repository } from 'typeorm';
import { EditTaskDto } from './dto/edit-task-dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends MongoRepository<Task> {
  async editTask(editTaskDto: EditTaskDto, id: string) {
    const task = await this.findOne(id);

    Object.assign(task, editTaskDto);
    return this.save(task);
  }
}
