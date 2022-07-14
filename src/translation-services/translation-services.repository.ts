import { EntityRepository, Repository } from 'typeorm';
import { TranslationServices } from './translation-services.entity';

@EntityRepository(TranslationServices)
export class TranslationServicesRepository extends Repository<TranslationServices> {}
