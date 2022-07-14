import { EntityRepository, Repository } from 'typeorm';
import { InHouse } from './entities/inhouse.entity';
@EntityRepository(InHouse)
export class InHouseRepository extends Repository<InHouse> {}
