import { EntityRepository, Repository } from 'typeorm';
import { ProjectClosure } from 'src/project-closure/entities/project-closure.entity';

@EntityRepository(ProjectClosure)
export class ProjectClosureRepository extends Repository<ProjectClosure> {}
