import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { User } from 'src/users/user.entity';
import {
  convertHoursToMS,
  convertMSToHoursString,
  getDate,
  getObjectId,
  getString,
  parseDate,
} from 'src/utilities';
import { ContractorTracksRepository } from './contractor-tracks.repository';
import {
  BreakEndDto,
  BreakStartDto,
  ClockInDto,
  ClockOutDto,
} from './dto/create-track';
import { IBreakTime, ITrackInfo, ITrackReport, IWorkTime } from './interfaces';

@Injectable()
export class ContractorTracksService {
  constructor(
    @InjectRepository(ContractorTracksRepository)
    private contractorTracksRepository: ContractorTracksRepository,
    @InjectRepository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
  ) {}

  async checkIfInhouseEmployee(userId: string) {
    let emp = await this.employeeRepository.findOne({
      where: {
        userId: userId,
        employmentType: 'Inhouse',
      },
    });

    if (emp) return true;
    return false;
  }

  async clockIn(trackInfo: ClockInDto, currentUser: User) {
    // if (!currentUser.contractorUser)
    //   throw new BadRequestException('No Contract Found');

    const { clockInTime } = trackInfo;
    const userId = getString(currentUser.id);

    let isInhouseEmployee = await this.checkIfInhouseEmployee(userId);
    if (!isInhouseEmployee)
      throw new BadRequestException('Not an In-House Employee');

    const newWorkingTime: IWorkTime = {
      clockInTime: clockInTime,
      clockOutTime: '',
    };

    let existingTrackInfo = await this.contractorTracksRepository.findOne({
      where: {
        userId: userId,
        date: getDate(new Date().toISOString()),
      },
    });

    if (existingTrackInfo) {
      existingTrackInfo.workingTime.forEach((workingTime) => {
        if (workingTime.clockOutTime === '')
          throw new ConflictException(
            `No clock-out for clock-in time ${workingTime.clockInTime}, can't start new clock in.`,
          );
      });

      existingTrackInfo.workingTime.push({
        clockInTime: clockInTime,
        clockOutTime: '',
      });

      return this.contractorTracksRepository.save(existingTrackInfo);
    }

    const newTrack = this.contractorTracksRepository.create({
      userId: currentUser.id.toString(),
      date: getDate(clockInTime),
      workingTime: [newWorkingTime],
    });

    return this.contractorTracksRepository.save(newTrack);
  }

  async clockOut(trackInfo: ClockOutDto, currentUser: User) {
    // if (!currentUser.contractorUser)
    //   throw new BadRequestException('No Contract Found');

    const objectId = getObjectId(trackInfo.id);
    const userId = getString(currentUser.id);

    let isInhouseEmployee = await this.checkIfInhouseEmployee(userId);
    if (!isInhouseEmployee)
      throw new BadRequestException('Not an In-House Employee');

    let trackInfoToUpdate = await this.contractorTracksRepository.findOne({
      where: {
        _id: objectId,
        userId: userId,
      },
    });

    if (!trackInfoToUpdate) {
      throw new NotFoundException(
        `Track Info with id ${trackInfo.id} not found`,
      );
    }

    const { clockInTime, clockOutTime } = trackInfo;

    let clockInDate = getDate(clockInTime);
    let clockOutDate = getDate(clockOutTime);

    // alternate flow
    // if the clock-in date and clock-out date doesn't match update clock-out for prev day track-info
    // and create a new track-info with clock-in starting at 1:0:0 for next day
    if (clockInDate !== clockOutDate) {
      let prevClockOutDate = new Date(clockInDate);
      prevClockOutDate.setHours(23, 59, 59, 999);
      let prevDateClockOutTime = prevClockOutDate.toISOString();

      trackInfoToUpdate.workingTime.forEach((workingTime) => {
        if (workingTime.clockInTime === clockInTime) {
          workingTime.clockOutTime = prevDateClockOutTime;
        }
      });

      // save the prev day track
      this.contractorTracksRepository.save(trackInfoToUpdate);

      // create new track-info for next day
      let nextClockInDate = new Date(clockOutDate);
      nextClockInDate.setHours(1, 0, 0, 0);
      let nextClockInTime = nextClockInDate.toISOString();

      const newWorkingTime: IWorkTime = {
        clockInTime: nextClockInTime,
        clockOutTime: clockOutTime,
      };

      const newTrack = this.contractorTracksRepository.create({
        userId: currentUser.id.toString(),
        date: getDate(nextClockInTime),
        workingTime: [newWorkingTime],
      });

      // save the next day track
      return this.contractorTracksRepository.save(newTrack);
    }

    // normal  flow
    trackInfoToUpdate.workingTime.forEach((workingTime) => {
      if (workingTime.clockInTime === clockInTime) {
        workingTime.clockOutTime = clockOutTime;
      }
    });

    return this.contractorTracksRepository.save(trackInfoToUpdate);
  }

  async breakStart(trackInfo: BreakStartDto, currentUser: User) {
    // if (!currentUser.contractorUser)
    //   throw new BadRequestException('No Contract Found');

    const objectId = getObjectId(trackInfo.id);
    const userId = getString(currentUser.id);

    let isInhouseEmployee = await this.checkIfInhouseEmployee(userId);
    if (!isInhouseEmployee)
      throw new BadRequestException('Not an In-House Employee');

    let trackInfoToUpdate = await this.contractorTracksRepository.findOne({
      where: {
        _id: objectId,
        userId: userId,
      },
    });

    if (!trackInfoToUpdate) {
      throw new NotFoundException(
        `Track Info with id ${trackInfo.id} not found`,
      );
    }

    const { breakStartTime } = trackInfo;

    const newBreakStartTime: IBreakTime = {
      breakStartTime: breakStartTime,
      breakEndTime: '',
    };

    if (trackInfoToUpdate.breakTime) {
      trackInfoToUpdate.breakTime.forEach((breakTime) => {
        if (breakTime.breakEndTime === '')
          throw new ConflictException(
            `Break didn't end for break start ${breakTime.breakStartTime}, can't start new break.`,
          );
      });

      trackInfoToUpdate.breakTime.push(newBreakStartTime);

      return this.contractorTracksRepository.save(trackInfoToUpdate);
    }

    trackInfoToUpdate = {
      ...trackInfoToUpdate,
      breakTime: [newBreakStartTime],
    };

    return this.contractorTracksRepository.save(trackInfoToUpdate);
  }

  async breakEnd(trackInfo: BreakEndDto, currentUser: User) {
    // if (!currentUser.contractorUser)
    //   throw new BadRequestException('No Contract Found');

    const objectId = getObjectId(trackInfo.id);
    const userId = getString(currentUser.id);

    let isInhouseEmployee = await this.checkIfInhouseEmployee(userId);
    if (!isInhouseEmployee)
      throw new BadRequestException('Not an In-House Employee');

    let trackInfoToUpdate = await this.contractorTracksRepository.findOne({
      where: {
        _id: objectId,
        userId: userId,
      },
    });

    if (!trackInfoToUpdate) {
      throw new NotFoundException(
        `Track Info with id ${trackInfo.id} not found`,
      );
    }

    const { breakStartTime, breakEndTime } = trackInfo;
    const breakStartDate = getDate(breakStartTime);
    const breakEndDate = getDate(breakEndTime);

    // alternate flow
    if (breakStartDate !== breakEndDate) {
      let prevBreakEndDate = new Date(breakStartDate);
      prevBreakEndDate.setHours(23, 59, 59, 999);
      let prevDateBreakEndTime = prevBreakEndDate.toISOString();

      trackInfoToUpdate.breakTime.forEach((breakTime) => {
        if (breakTime.breakStartTime === breakStartTime) {
          breakTime.breakEndTime = prevDateBreakEndTime;
          trackInfoToUpdate.workingTime[
            trackInfoToUpdate.workingTime.length - 1
          ].clockOutTime = prevDateBreakEndTime;
        }
      });

      // save the prev day track
      this.contractorTracksRepository.save(trackInfoToUpdate);

      // create new track-info for next day
      let nextClockInDate = new Date(breakEndDate);
      nextClockInDate.setHours(0, 0, 0, 0);
      let nextClockInTime = nextClockInDate.toISOString();

      const newWorkingTime: IWorkTime = {
        clockInTime: nextClockInTime,
        clockOutTime: '',
      };

      const newBreakTime: IBreakTime = {
        breakStartTime: nextClockInTime,
        breakEndTime: breakEndTime,
      };

      const newTrack = this.contractorTracksRepository.create({
        userId: currentUser.id.toString(),
        date: getDate(nextClockInTime),
        workingTime: [newWorkingTime],
        breakTime: [newBreakTime],
      });

      // save the next day track
      return this.contractorTracksRepository.save(newTrack);
    }

    // normal flow
    trackInfoToUpdate.breakTime.forEach((breakTime) => {
      if (breakTime.breakStartTime === breakStartTime) {
        breakTime.breakEndTime = breakEndTime;
      }
    });

    return this.contractorTracksRepository.save(trackInfoToUpdate);
  }

  async getTrackById(id: string, currentUser: User) {
    // if (!currentUser.contractorUser)
    //   throw new BadRequestException('No Contract Found');

    const objectId = getObjectId(id);
    const userId = getString(currentUser.id);

    let isInhouseEmployee = await this.checkIfInhouseEmployee(userId);
    if (!isInhouseEmployee)
      throw new BadRequestException('Not an In-House Employee');

    let trackInfo = await this.contractorTracksRepository.findOne({
      where: {
        _id: objectId,
        userId: userId,
      },
    });

    if (!trackInfo) {
      throw new NotFoundException(`Track Info with id ${id} not found`);
    }

    return trackInfo;
  }

  async getTrackByDate(date: string, currentUser: User) {
    // if (!currentUser.contractorUser)
    //   throw new BadRequestException('No Contract Found');

    const userId = getString(currentUser.id);

    let isInhouseEmployee = await this.checkIfInhouseEmployee(userId);
    if (!isInhouseEmployee)
      throw new BadRequestException('Not an In-House Employee');

    let trackInfo = await this.contractorTracksRepository.findOne({
      where: {
        userId: userId,
        date: getDate(date ?? getDate(new Date().toISOString())),
      },
    });

    if (!trackInfo) {
      throw new NotFoundException(`Track Info for ${date} not found`);
    }

    return trackInfo;
  }

  async getTracks(currentUser: User) {
    // if (!currentUser.contractorUser)
    //   throw new BadRequestException('No Contract Found');

    const userId = getString(currentUser.id);

    let isInhouseEmployee = await this.checkIfInhouseEmployee(userId);
    if (!isInhouseEmployee)
      throw new BadRequestException('Not an In-House Employee');

    let trackInfo = await this.contractorTracksRepository.find({
      where: {
        userId: userId,
      },
    });

    if (!trackInfo) {
      throw new NotFoundException(
        `Track Info for ${new Date().toDateString()} not found`,
      );
    }

    return trackInfo;
  }

  async getTrackReportById(id: string) {
    const objectId = getObjectId(id);

    let trackInfo = await this.contractorTracksRepository.findOne({
      where: {
        _id: objectId,
      },
    });

    if (!trackInfo) {
      throw new NotFoundException(`Track Info with id ${id} not found`);
    }

    let trackReport = await this.generateTrackReport(trackInfo, null);

    return trackReport;
  }

  async getTrackReportByDate(date: string, userId: string) {
    if (!date) throw new BadRequestException(`Date not found.`);
    if (!userId) throw new BadRequestException(`User Id not found.`);

    let trackInfo = await this.contractorTracksRepository.findOne({
      where: {
        userId: userId,
        date: date,
      },
    });

    let emp = await this.employeeRepository.findOne({
      select: ['prescribedTime'],
      where: {
        userId: userId,
      },
    });

    if (!trackInfo) {
      throw new NotFoundException(`Track Info for date ${date} not found.`);
    }

    let trackReport = await this.generateTrackReport(
      trackInfo,
      emp.prescribedTime,
    );

    return trackReport;
  }

  async getTrackReportBetween(
    startDate: string,
    endDate: string,
    userId: string,
  ) {
    if (!startDate) throw new BadRequestException(`Start Date not found.`);
    if (!endDate) throw new BadRequestException(`End Date not found.`);
    if (!userId) throw new BadRequestException(`User Id not found.`);

    let trackInfos = await this.contractorTracksRepository.find({
      where: {
        userId: userId,
        date: { $gte: getDate(startDate), $lte: getDate(endDate) },
      },
    });

    let emp = await this.employeeRepository.findOne({
      select: ['prescribedTime'],
      where: {
        userId: userId,
      },
    });

    if (!trackInfos) {
      throw new NotFoundException(`Track Infos for user not found.`);
    }

    let trackReports: ITrackReport[] = [];

    for (let trackInfo of trackInfos) {
      let trackReport = await this.generateTrackReport(
        trackInfo,
        emp.prescribedTime,
      );
      trackReports.push(trackReport);
    }

    return trackReports;
  }

  async getTrackReports(userId: string) {
    if (!userId) throw new BadRequestException(`User Id not found.`);

    let trackInfos = await this.contractorTracksRepository.find({
      where: {
        userId: userId,
      },
    });

    let emp = await this.employeeRepository.findOne({
      select: ['prescribedTime'],
      where: {
        userId: userId,
      },
    });

    if (!trackInfos) {
      throw new NotFoundException(`Track Infos for user not found.`);
    }

    let trackReports: ITrackReport[] = [];

    for (let trackInfo of trackInfos) {
      let trackReport = await this.generateTrackReport(
        trackInfo,
        emp.prescribedTime,
      );
      trackReports.push(trackReport);
    }

    return trackReports;
  }

  async getActiveTrack(currentUser: User) {
    const user_id = getString(currentUser.id);

    let oldTrack = false;
    let active = false;
    let response = null;

    let lastTrack = await this.contractorTracksRepository.findOne({
      where: {
        userId: user_id,
      },
      order: { date: 'DESC' },
    });

    if (!lastTrack)
      return {
        message: "No Tracks available"
      }

    let workingTime = lastTrack.workingTime;
    let lastWorkingTime = workingTime.slice(-1)[0];

    if (
      lastWorkingTime.clockOutTime === '' &&
      parseDate(lastTrack.date) < parseDate(getDate(new Date().toISOString()))
    ) {
      let tmp = new Date(lastTrack.date);
      tmp.setHours(23, 59, 59, 999);
      lastWorkingTime.clockOutTime = tmp.toISOString();

      const trackInfoToUpdate = {
        ...lastTrack,
        _id: getObjectId(lastTrack.id),
      };

      this.contractorTracksRepository.save(trackInfoToUpdate);

      oldTrack = true;
    } else if (
      parseDate(lastTrack.date) < parseDate(getDate(new Date().toISOString()))
    ) {
      oldTrack = true;
    } else if (lastWorkingTime.clockOutTime === '') {
      active = true;
    }

    if (!oldTrack)
      response = {
        active,
        ...lastTrack,
        id: getString(lastTrack.id),
      };

    return response;
  }

  async generateTrackReport(
    trackInfo: ITrackInfo,
    prescribedTime: string,
    convertToHour: boolean = true,
  ) {
    let trackReport: ITrackReport | any;

    let emptyFlag = false;

    let trackedTimeMS = 0;
    let breakTimeMS = 0;

    let { workingTime } = trackInfo;

    workingTime.forEach((workTime) => {
      let clockOutTime = workTime.clockOutTime;

      if (clockOutTime === '') {
        // if date for report retrieval and time tracking is same return current time as clockOutTime
        if (
          parseDate(getDate(trackInfo.date)) >=
          parseDate(getDate(new Date().toISOString()))
        ) {
          clockOutTime = new Date().toISOString();
        } else {
          let tmp = new Date(trackInfo.date);
          tmp.setHours(23, 59, 59, 999);
          clockOutTime = tmp.toISOString();

          workTime.clockOutTime = clockOutTime;

          emptyFlag = true;
        }
      }

      trackedTimeMS +=
        parseDate(clockOutTime).getTime() -
        parseDate(workTime.clockInTime).getTime();
    });

    if (trackInfo.breakTime) {
      let { breakTime } = trackInfo;

      breakTime.forEach((breakTime) => {
        let breakEndTime = breakTime.breakEndTime;

        if (breakTime.breakEndTime === '') {
          if (
            parseDate(getDate(trackInfo.date)) >=
            parseDate(getDate(new Date().toISOString()))
          ) {
            breakEndTime = new Date().toISOString();
          } else {
            let tmp = new Date(trackInfo.date);
            tmp.setHours(23, 59, 59, 999);
            breakEndTime = tmp.toISOString();

            breakTime.breakEndTime = breakEndTime;

            emptyFlag = true;
          }
        }

        breakTimeMS +=
          parseDate(breakEndTime).getTime() -
          parseDate(breakTime.breakStartTime).getTime();
      });
    }

    if (emptyFlag) {
      emptyFlag = false;
      const trackInfoToUpdate = {
        ...trackInfo,
        _id: getObjectId(trackInfo.id),
      };
      this.contractorTracksRepository.save(trackInfoToUpdate);
    }

    let totalWorkedMS = trackedTimeMS - breakTimeMS;
    let prescribedMS = convertHoursToMS(prescribedTime);
    let overTime =
      totalWorkedMS > prescribedMS ? totalWorkedMS - prescribedMS : 0;

    if (convertToHour){
      trackReport = {
        date: trackInfo.date,
        // workingTime: trackInfo.workingTime,
        trackedHours: convertMSToHoursString(trackedTimeMS),
        totalBreak: convertMSToHoursString(breakTimeMS),
        totalWorkedHours: convertMSToHoursString(totalWorkedMS),
        prescribedHours: convertMSToHoursString(prescribedMS),
        overtime: convertMSToHoursString(overTime),
      };
      
      return trackReport;
    }

    trackReport = {
      date: trackInfo.date,
      trackedTimeMS,
      breakTimeMS,
      totalWorkedMS,
      prescribedMS,
      overTime,
    };

    return trackReport;
  }

  async getTotalTrackInMS(userId: string) {
    if (!userId) throw new BadRequestException(`User Id not found.`);

    let trackInfos = await this.contractorTracksRepository.find({
      where: {
        userId: userId,
      },
    });

    let emp = await this.employeeRepository.findOne({
      select: ['prescribedTime'],
      where: {
        userId: userId,
      },
    });

    if (!trackInfos) {
      throw new NotFoundException(`Track Infos for user not found.`);
    }

    let totalBaseTimeMS = 0;
    let totalOvertimeMS = 0;
    
    let tracks = [];

    for (let trackInfo of trackInfos) {
      let trackReport = await this.generateTrackReport(
        trackInfo,
        emp.prescribedTime,
        false,
      );

      tracks.push(
        {
          date: trackReport.date,
          trackedHours: convertMSToHoursString(trackReport.trackedTimeMS),
          totalBreak: convertMSToHoursString(trackReport.breakTimeMS),
          totalWorkedHours: convertMSToHoursString(trackReport.totalWorkedMS),
          overtime: convertMSToHoursString(trackReport.overTime),
          prescribedHours: convertMSToHoursString(trackReport.prescribedMS),

          totalBaseTimeMS: trackReport.totalWorkedMS - trackReport.overTime,
          totalOvertimeMS: trackReport.overTime,
        }
      )

      totalBaseTimeMS += (trackReport.totalWorkedMS - trackReport.overTime);
      totalOvertimeMS += trackReport.overTime;
    }

    return {
      tracks,
      totalBaseTimeMS,
      totalOvertimeMS
    };
  }
  
  async getTotalTrackBetweenDateInMS(userId: string, startDate: string, endDate: string) {
    if (!userId) throw new BadRequestException(`User Id not found.`);

    let trackInfos = await this.contractorTracksRepository.find({
      where: {
        userId: userId,
        date: { $gte: getDate(startDate), $lte: getDate(endDate) },
      },
    });

    let emp = await this.employeeRepository.findOne({
      select: ['prescribedTime'],
      where: {
        userId: userId,
      },
    });

    if (!trackInfos) {
      throw new NotFoundException(`Track Infos for user not found.`);
    }

    let totalBaseTimeMS = 0;
    let totalOvertimeMS = 0;
    
    let tracks = [];

    for (let trackInfo of trackInfos) {
      let trackReport = await this.generateTrackReport(
        trackInfo,
        emp.prescribedTime,
        false,
      );

      tracks.push(
        {
          date: trackReport.date,
          trackedHours: convertMSToHoursString(trackReport.trackedTimeMS),
          totalBreak: convertMSToHoursString(trackReport.breakTimeMS),
          totalWorkedHours: convertMSToHoursString(trackReport.totalWorkedMS),
          overtime: convertMSToHoursString(trackReport.overTime),
          prescribedHours: convertMSToHoursString(trackReport.prescribedMS),

          totalBaseTimeMS: trackReport.totalWorkedMS - trackReport.overTime,
          totalOvertimeMS: trackReport.overTime,
        }
      )

      totalBaseTimeMS += (trackReport.totalWorkedMS - trackReport.overTime);
      totalOvertimeMS += trackReport.overTime;
    }

    return {
      tracks,
      totalBaseTimeMS,
      totalOvertimeMS
    };
  }
}
