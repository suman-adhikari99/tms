import { EntityRepository, MongoRepository, Repository } from 'typeorm';
import { EditProjectDto } from './dto/edit-project-dto';
import { Project } from './project.entity';

@EntityRepository(Project)
export class ProjectManagement extends MongoRepository<Project> {
  async editProject(editProjectDto: EditProjectDto, id: string) {
    const project = await this.findOne(id);
    // replace the project properties with editProjectDto properties
    Object.assign(project, editProjectDto);
    console.log(project);
    return this.save(project);
  }
}
