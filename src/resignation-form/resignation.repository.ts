import { EntityRepository, Repository } from 'typeorm';
// import { EditProjectDto } from './dto/edit-project-dto';
import { Resignation } from './resignation.entity';

@EntityRepository(Resignation)
export class ResignationRepository extends Repository<Resignation> {}
