import { EntityRepository, Repository, MongoRepository } from 'typeorm';
import { ContractorTracks } from './contractor-tracks.entity';

@EntityRepository(ContractorTracks)
export class ContractorTracksRepository extends MongoRepository<ContractorTracks> {}
