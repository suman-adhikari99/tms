import { EntityRepository, MongoRepository, Repository } from 'typeorm';
import { ProjectReopen } from './project-reopen.entity';

@EntityRepository(ProjectReopen)
export class ProjectReopenRepository extends MongoRepository<ProjectReopen> {}
