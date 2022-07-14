import { User } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { AssistanceServices } from './assistance-services.entity';
import { SaveAssistanceServicesDto } from './dto/save-assistance-services.dto';

@EntityRepository(AssistanceServices)
export class AssistanceServicesRepository extends Repository<AssistanceServices> {}
