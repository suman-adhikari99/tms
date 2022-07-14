import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { ContractorTracksService } from './contractor-tracks.service';
import {
  BreakEndDto,
  BreakStartDto,
  ClockInDto,
  ClockOutDto,
} from './dto/create-track';

@Controller('clock-track')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ContractorTracksController {
  constructor(private tracksSevice: ContractorTracksService) {}

  @Post('/clock-in')
  clockIn(@Body() trackInfo: ClockInDto, @CurrentUser() currentUser: User) {
    console.log(trackInfo);
    return this.tracksSevice.clockIn(trackInfo, currentUser);
  }

  @Post('/clock-out')
  clockOut(@Body() trackInfo: ClockOutDto, @CurrentUser() currentUser: User) {
    return this.tracksSevice.clockOut(trackInfo, currentUser);
  }

  @Post('/break-start')
  breakStart(
    @Body() trackInfo: BreakStartDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.tracksSevice.breakStart(trackInfo, currentUser);
  }

  @Post('/break-end')
  breakEnd(@Body() trackInfo: BreakEndDto, @CurrentUser() currentUser: User) {
    return this.tracksSevice.breakEnd(trackInfo, currentUser);
  }

  @Get('/track-info')
  getTrackByDate(
    @Query('date') date: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.tracksSevice.getTrackByDate(date, currentUser);
  }

  @Get('/track-info/id/:id')
  getTrackById(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.tracksSevice.getTrackById(id, currentUser);
  }

  @Get('/tracks')
  getTracks(@CurrentUser() currentUser: User) {
    return this.tracksSevice.getTracks(currentUser);
  }

  @Get('/track-report')
  getTrackReportByDate(
    @Query('userId') userId: string,
    @Query('date') date: string,
  ) {
    return this.tracksSevice.getTrackReportByDate(date, userId);
  }

  @Get('/track-report/id/:id')
  getTrackReportById(
    @Param('id') id: string,
  ) {
    return this.tracksSevice.getTrackReportById(id);
  }

  @Get('/track-reports')
  getTrackReports(@Query('userId') userId: string) {
    return this.tracksSevice.getTrackReports(userId);
  }

  @Get('/track-reports/between')
  getTrackReportBetween(
    @Query('userId') userId: string,
    @Query('startdate') startDate: string,
    @Query('enddate') endDate: string,
  ) {
    return this.tracksSevice.getTrackReportBetween(
      startDate,
      endDate,
      userId,
    );
  }

  @Get('/active-track')
  getActiveTrack(@CurrentUser() currentUser: User) {
    return this.tracksSevice.getActiveTrack(currentUser);
  }
}
