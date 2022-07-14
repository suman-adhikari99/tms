import { EntityRepository,MongoRepository } from 'typeorm';
import { Benefit } from 'src/benefits/entities/benefit.entity';

@EntityRepository(Benefit)
export class BenefitRepository extends MongoRepository<Benefit> {}
