import { EntityRepository, Repository } from "typeorm";
import { DeliveryPlans } from "./delivery-plans.entity";

@EntityRepository(DeliveryPlans)
export class DeliveryPlansRepository extends Repository<DeliveryPlans>{ }