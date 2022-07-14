import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractorTracksRepository } from 'src/contractor-tracks/contractor-tracks.repository';
import { ITrackInfo, ITrackReport } from 'src/contractor-tracks/interfaces';
import { User } from 'src/users/user.entity';
import {
  convertHoursToMS,
  convertMSToHoursString,
  getDate,
  getObjectId,
  getString,
  parseDate,
} from 'src/utilities';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(ContractorTracksRepository)
    private contractorTracksRepository: ContractorTracksRepository,
  ) {}

  async getTimesheetReportsBetween(
    startDate: string,
    endDate: string,
    currentUser: User,
  ) {
    if (!(currentUser.role.activeRole === 'AM'))
      throw new BadRequestException('Only admin can view timesheet reports');

    let trackInfos = await this.contractorTracksRepository
      .aggregate([
        {
          $match: {
            date: { $gte: getDate(startDate), $lte: getDate(endDate) },
          },
        },
        {
          $lookup: {
            from: 'employee',
            localField: 'userId',
            foreignField: 'userId',
            as: 'employee',
          },
        },
        {
          $group: {
            _id: '$employee',
            tracks: {
              $push: {
                id: '$_id',
                userId: '$userId',
                date: '$date',
                workingTime: '$workingTime',
                breakTime: '$breakTime',
              },
            },
          },
        },
      ])
      .toArray();

    let trackReports: ITrackReport[] = [];

    for (let trackInfo of trackInfos) {
      let trackReport = await this.generateTimesheetReport(
        trackInfo?.tracks,
        trackInfo?._id[0].prescribedTime,
      );
      trackReport = {
        employeeId: getString(trackInfo?._id[0]?._id),
        employeeName: trackInfo?._id[0]?.fullName,
        employmentType: trackInfo?._id[0]?.employmentType,
        image: trackInfo?._id[0]?.image,
        ...trackReport,
      };
      trackReports.push(trackReport);
    }

    return trackReports;
  }

  async getTimesheetReports(currentUser: User) {
    if (!(currentUser.role.activeRole === 'AM'))
      throw new BadRequestException('Only admin can view timesheet reports');

    let trackInfos = await this.contractorTracksRepository
      .aggregate([
        {
          $lookup: {
            from: 'employee',
            localField: 'userId',
            foreignField: 'userId',
            as: 'employee',
          },
        },
        {
          $group: {
            _id: '$employee',
            tracks: {
              $push: {
                id: '$_id',
                userId: '$userId',
                date: '$date',
                workingTime: '$workingTime',
                breakTime: '$breakTime',
              },
            },
          },
        },
      ])
      .toArray();

    let trackReports: ITrackReport[] = [];

    for (let trackInfo of trackInfos) {
      let trackReport = await this.generateTimesheetReport(
        trackInfo?.tracks,
        trackInfo?._id[0].prescribedTime,
      );
      trackReport = {
        employeeId: getString(trackInfo?._id[0]?._id),
        employeeName: trackInfo?._id[0]?.fullName,
        employmentType: trackInfo?._id[0]?.employmentType,
        image: trackInfo?._id[0]?.image,
        ...trackReport,
      };
      trackReports.push(trackReport);
    }

    return trackReports;
  }

  async generateTimesheetReport(
    trackInfos: ITrackInfo[],
    prescribedTime: string,
  ) {
    let trackReport: ITrackReport;

    let emptyFlag = false;

    let trackedTimeMS = 0;
    let breakTimeMS = 0;

    for (let trackInfo of trackInfos) {
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
    }

    let totalWorkedMS = trackedTimeMS - breakTimeMS;
    let prescribedMS = convertHoursToMS(prescribedTime);
    // let prescribedMS = 8 * 60 * 60 * 1000;
    let overTime =
      totalWorkedMS > prescribedMS ? totalWorkedMS - prescribedMS : 0;

    trackReport = {
      trackedHours: convertMSToHoursString(trackedTimeMS),
      totalBreak: convertMSToHoursString(breakTimeMS),
      totalWorkedHours: convertMSToHoursString(totalWorkedMS),
      prescribedHours: convertMSToHoursString(prescribedMS),
      overtime: convertMSToHoursString(overTime),
    };

    return trackReport;
  }
}
