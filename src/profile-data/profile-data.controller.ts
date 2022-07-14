import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileDataService } from './profile-data.service';

@Controller('profile-data')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileDataController {
  constructor(private readonly profileDataService: ProfileDataService) {}

  @Put('/request-role/:id')
  addRole(@Param('id') id: string, @Body() newProfile: UpdateProfileDto) {
    return this.profileDataService.addRole(id, newProfile);
  }

  @Put('/insert-role/:id/:nId')
  insertRole(@Param('id') id: string, @Param('nId') nId: string) {
    return this.profileDataService.approveRole(id, nId);
  }

  @Put('/reject-role/:id/:nId') // profile-data entity vitra ko userId
  rejectRole(@Param('id') id: string, @Param('nId') nId: string) {
    return this.profileDataService.rejectRole(id, nId);
  }

  @Put('/update-education/:id')
  addEducation(
    @Param('id') id: string,
    @Body() profileData: UpdateProfileDto,
    @Req() request: Request,
  ) {
    return this.profileDataService.addEducation(id, profileData, request);
  }

  @Put('/edit-education/:ind/:id')
  updateEducation(
    @Param('ind') ind: number,
    @Param('id') id: string,
    @Body() newProfile: UpdateProfileDto,
    @Req() request: Request,
  ) {
    return this.profileDataService.editEducation(ind, id, newProfile, request);
  }

  @Delete('/delete-education/:ind/:id')
  deleteEducation(
    @Param('ind') ind: number,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return this.profileDataService.deleteEducation(ind, id, request);
  }

  @Put('/edit-work/:ind/:id')
  editWork(
    @Param('ind') ind: number,
    @Param('id') id: string,
    @Body() profileData: UpdateProfileDto,
    @Req() request: Request,
  ) {
    return this.profileDataService.editWork(ind, id, profileData, request);
  }

  @Delete('/delete-work/:ind/:id')
  deleteWork(
    @Param('id') ind: number,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return this.profileDataService.deleteWork(ind, id, request);
  }

  @Put('/update/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() profileData: UpdateProfileDto,
    @Req() request: Request,
  ) {
    return this.profileDataService.updateProfile(id, profileData, request);
  }

  @Put('/update-payment/:id')
  updatePaymentInfo(
    @Param('id') id: string,
    @Body() profileData: UpdateProfileDto,
    @Req() request: Request,
  ) {
    return this.profileDataService.updatePaymentInfo(id, profileData, request);
  }

  @Put('/update-work/:id')
  updateWork(
    @Param('id') id: string,
    @Body() profileData: UpdateProfileDto,
    @Req() request: Request,
  ) {
    return this.profileDataService.addWork(id, profileData, request);
  }

  @Put('/update-document/:id')
  updateDocument(
    @Param('id') id: string,
    @Body() profileData: UpdateProfileDto,
    @Req() request: Request,
  ) {
    return this.profileDataService.updateDocument(id, profileData, request);
  }

  // @Post()
  // createProfile(
  //   @Body() profileData: CreateProfileDto,

  //   @Req() request: Request,
  // ) {
  //   return this.profileDataService.createProfile(profileData, request);
  // }
  @Get('/:userId')
  getProfileByUserId(@Param('userId') userId: string) {
    return this.profileDataService.getProfileByUserId(userId);
  }

  @Get()
  getProfileById(@CurrentUser() user: User) {
    return this.profileDataService.getProfileById(user);
  }
}

// @Put('/edit-education/:ind/:id')
// editEducation(
//   @Param('id') ind: number,
//   @Param('id') id: string,
//   @Body() profileData: UpdateProfileDto,
// ) {
//   return this.profileDataService.editEducation(ind, id, profileData);
// }

// @Delete('/delete-education/:ind/:id')
// deleteEducation(@Param('id') ind: number, @Param('id') id: string) {
//   return this.profileDataService.deleteEducation(ind, id);
// }

// @Delete('/delete-education/:id')
// deleteEducation(
//   @Body() profileData: UpdateProfileDto,
//   @Param('id') id: string,
// ) {
//   return this.profileDataService.deleteEducation(profileData, id);
// }
