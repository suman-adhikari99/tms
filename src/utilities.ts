import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export const getObjectId = (id: string | ObjectId): ObjectId => {
  if (typeof id === 'string') {
    return new ObjectId(id);
  }
  return id;
};

export const getString = (id: string | ObjectId = ''): string => {
  try {
    if (typeof id === 'string') {
      return id;
    }
    return id.toString();
  } catch (error) {
    throw new BadRequestException('Invalid id');
  }
};

export const getDate = (dateISOString: string) => {
  return dateISOString.split('T')[0];
};

export const parseDate = (dateISOString: string) => {
  return new Date(dateISOString);
};

export const convertMSToHoursString = (milliseconds: number) => {
  let seconds = Math.trunc((milliseconds / 1000) % 60);
  let minutes = Math.trunc((milliseconds / (1000 * 60)) % 60);
  let hours = Math.trunc((milliseconds / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export const convertMSToHours = (milliseconds: number) => {
  let hours = milliseconds / (1000 * 60 * 60);
  return hours;
};

export const convertHoursToMS = (hours: string) => {
  if (!hours) return 0;
   
  let timeArr = hours.split(' ', 2);
  let hour = Number(timeArr[0].slice(0, -1));
  let minutes = Number(timeArr[1].slice(0, -1));

  return hour * 60 * 60 * 1000 + minutes * 60 * 1000;
};

// import { BadRequestException } from '@nestjs/common';
// import { ObjectId } from 'mongodb';

// export const getObjectId = (id: string | ObjectId): ObjectId => {
//   if (typeof id === 'string') {
//     return new ObjectId(id);
//   }
//   return id;
// };

// export const getString = (id: string | ObjectId = ''): string => {
//   try {
//     if (typeof id === 'string') {
//       return id;
//     }
//     return id.toString();
//   } catch (error) {
//     throw new BadRequestException('Invalid id');
//   }
// };
