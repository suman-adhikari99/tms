import { EntityRepository, Repository } from 'typeorm';
import { ProfileData } from './profile-data.entity';

@EntityRepository(ProfileData)
export class ProfileDataRepository extends Repository<ProfileData> {}
