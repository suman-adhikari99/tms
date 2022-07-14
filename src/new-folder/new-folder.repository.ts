import { EntityRepository, Repository } from 'typeorm';
import { NewFolder } from './new-folder.entity';

@EntityRepository(NewFolder)
export class NewFolderRepository extends Repository<NewFolder> {}
