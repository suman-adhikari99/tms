import { EntityRepository, MongoRepository } from 'typeorm';
import { Notifications } from './notifications.entity';

@EntityRepository(Notifications)
export class NotificationsRepository extends MongoRepository<Notifications> {}
