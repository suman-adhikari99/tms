import { User } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { AssistanceRequests } from './assistance-requests.entity';
import { SaveAssistanceRequestsDto } from './dto/save-assistance-requests.dto';
import { UpdateAssistanceRequestsDto } from './dto/update-save-assistanceRequests-dto';

@EntityRepository(AssistanceRequests)
export class AssistanceRequestsRepository extends Repository<AssistanceRequests> {
  async editAssistanceRequest(
    editRequest: UpdateAssistanceRequestsDto,
    id: string,
  ) {
    const request = await this.findOne(id);
    Object.assign(request, editRequest);
    return this.save(request);
  }
  // saveAssistanceRequests(
  //   assistanceRequest: SaveAssistanceRequestsDto,
  //   // user: User,
  // ) {
  //   const newAssistanceService = this.create({
  //     ...assistanceRequest,

  //   });
  //   return this.save(newAssistanceService);
  // }
}
