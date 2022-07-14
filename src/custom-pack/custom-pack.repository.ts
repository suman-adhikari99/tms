import { EntityRepository, Repository } from 'typeorm';
import { CustomPack } from './custom-pack.entity';

@EntityRepository(CustomPack)
export class CustomPackRepository extends Repository<CustomPack> {}
