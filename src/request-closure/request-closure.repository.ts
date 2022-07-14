import { EntityRepository, Repository } from 'typeorm';
import { RequestClosure } from './request-closure.entity';

@EntityRepository(RequestClosure)
export class RequestClosureRepository extends Repository<RequestClosure> {}
