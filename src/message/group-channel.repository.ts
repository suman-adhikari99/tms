import { EntityRepository, Repository } from 'typeorm';
import { GroupChannel } from './group-channel.entity';

@EntityRepository(GroupChannel)
export class GroupChannelRepository extends Repository<GroupChannel> {}
