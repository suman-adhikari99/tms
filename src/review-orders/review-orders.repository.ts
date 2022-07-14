import { User } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ReviewOrder } from './review-orders.entity';

@EntityRepository(ReviewOrder)
export class ReviewOrderRepository extends Repository<ReviewOrder> {}
