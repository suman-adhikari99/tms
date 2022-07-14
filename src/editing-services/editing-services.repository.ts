import { EntityRepository, Repository } from 'typeorm';
import { EditingServices } from './editing-services.entity';

@EntityRepository(EditingServices)
export class EditingServicesRepository extends Repository<EditingServices> {}
