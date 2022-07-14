import { EntityRepository, Repository } from "typeorm";
import { OptionalService } from "./optional-service.entity";

@EntityRepository(OptionalService)
export class OptionalServiceRepository extends Repository<OptionalService>{ }