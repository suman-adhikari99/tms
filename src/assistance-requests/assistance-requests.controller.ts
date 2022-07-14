import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { AssistanceRequestsService } from './assistance-requests.service';
import { SaveAssistanceRequestsDto } from './dto/save-assistance-requests.dto';
import { AddFileForAssistanceRequestDto, UpdateAssistanceRequestsDto } from './dto/update-save-assistanceRequests-dto';

@Controller('assistance-requests')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AssistanceRequestsController {
  constructor(private assistanceRequest: AssistanceRequestsService) {}

  @Post()
  saveAssistanceService(
    @Body() assistanceRequest: SaveAssistanceRequestsDto,
    @CurrentUser() user: User,
  ) {
    return this.assistanceRequest.saveAssistanceRequestFinal(
      assistanceRequest,
      user,
    );
  }

  @Put('/activeDocument/:id')
  addActiveDocument(
    @Body() updateAssistanceRequest: AddFileForAssistanceRequestDto,
    @Param('id') id: string,
  ) {
    return this.assistanceRequest.addActiveDocument(
      updateAssistanceRequest,
      id,
    );
  }

  @Put('/supportingDocument/:id')
  addSupportingDocument(
    @Body() updateAssistanceRequest: UpdateAssistanceRequestsDto,
    @Param('id') id: string,
  ) {
    return this.assistanceRequest.addSupportingDocument(
      updateAssistanceRequest,
      id,
    );
  }

  @Put('/deliverable/:id')
  addDeliverable(
    @Body() updateAssistanceRequest: UpdateAssistanceRequestsDto,
    @Param('id') id: string,
  ) {
    return this.assistanceRequest.addDeliverable(updateAssistanceRequest, id);
  }

  @Put('/accept/:arId')
  acceptthisTask(@Param('arId') arId: string, @CurrentUser() user: User) {
    return this.assistanceRequest.acceptAssistanceRequest(arId, user);
  }

  @Put('/reject/:arId')
  rejectthisTask(@Param('arId') arId: string, @CurrentUser() user: User) {
    return this.assistanceRequest.rejectAssistanceRequest(arId, user);
  }

  // @Put('/cmAccept/:arId')
  // cmTaskApproval(@Param('arId') arId: string, @CurrentUser() user: User) {
  //   return this.assistanceRequest.acceptthisAssistanceRequest(arId, user);
  // }

  @Put('/requestToParticipate/:arId')
  requestToParticipateForTask(
    @Param('taskId') arId: string,
    @CurrentUser() user: User,
  ) {
    return this.assistanceRequest.requestToParticipateForAssistanceRequest(
      arId,
      user,
    );
  }

  @Put('/acceptJoinRequest/:arId/:userid')
  acceptJoinRequestForTask(
    @Param('arId') arId: string,
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ) {
    return this.assistanceRequest.acceptJoinRequestForAssistanceRequest(
      arId,
      userid,
      user,
    );
  }

  @Put('/rejectJoinRequest/:arId/:userid')
  rejectJoinRequestForTask(
    @Param('arId') arId: string,
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ) {
    return this.assistanceRequest.rejectJoinRequestForAssistanceRequest(
      arId,
      userid,
      user,
    );
  }

  @Put('/add-teamMember/:id')
  addTeamMember(
    @Param('id') id: string,
    @Body() updateAssistance: UpdateAssistanceRequestsDto,
    @CurrentUser() user: User,
  ) {
    return this.assistanceRequest.addTeamMember(id, updateAssistance, user);
  }

  @Delete('/delete-teamMember/:id/:index')
  deleteTeamMember(@Param('id') id: string, @Param('index') index: number) {
    return this.assistanceRequest.deleteTeamMember(id, index);
  }

  // @Get('/forClientManager')
  // getAssistanceRequestForClientManager(@CurrentUser() user: User) {
  //   console.log('Hello');
  //   return this.assistanceRequest.getAssistanceRequestForClientManager(user);
  // }

  @Get('/my')
  getMyAssistanceRequests(@CurrentUser() user: User) {
    return this.assistanceRequest.getMyAssistanceRequest(user);
  }

  @Get('/id/:id')
  getAssistanceRequestById(@Param('id') id: string) {
    return this.assistanceRequest.getAssistanceRequestById(id);
  }

  @Get('/all')
  getAllAssistanceRequests() {
    return this.assistanceRequest.getAllAssistanceRequests();
  }

  @Put('/cancelRequest/:rId')
  @UseGuards(AuthGuard)
  cancelOrder(@Param('rId') rId: string, @CurrentUser() user: User) {
    return this.assistanceRequest.cancelRequest(rId, user);
  }

  @Put('/:aId')
  // @UseGuards(AuthGuard)
  editRequest(
    @Body() editRequest: UpdateAssistanceRequestsDto,
    @Param('aId') aId: string,
    @CurrentUser() user: User,
  ) {
    console.log(editRequest);
    return this.assistanceRequest.editRequest(editRequest, aId, user);
  }
}
