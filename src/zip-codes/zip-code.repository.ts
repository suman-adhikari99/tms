import { EntityRepository, Repository } from 'typeorm';
import { ZipCode } from './zip-code.entity';

@EntityRepository(ZipCode)
export class ZipCodeRepository extends Repository<ZipCode> {}
