import { EntityRepository, Repository, MongoRepository } from 'typeorm';
import { EmployeeWork } from './employee-work.entity';

@EntityRepository(EmployeeWork)
export class EmployeeWorkRepository extends MongoRepository<EmployeeWork> {}
