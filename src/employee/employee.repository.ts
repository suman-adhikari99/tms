import { EntityRepository, MongoRepository } from 'typeorm';
import { Employee } from './employee.entity';

@EntityRepository(Employee)
export class EmployeeRepository extends MongoRepository<Employee> {}
