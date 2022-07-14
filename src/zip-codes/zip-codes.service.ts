import { Injectable } from '@nestjs/common';
import { ZipCodeRepository } from './zip-code.repository';

const limit = 15;

@Injectable()
export class ZipCodesService {
  constructor(private zipCodeRepository: ZipCodeRepository) {}

  getAllData(take?: number, skip?: number) {
    return this.zipCodeRepository.find({
      skip: skip || 0,
      take: take ? take : undefined,
    });
  }

  getAllRegions() {
    return this.zipCodeRepository.find({ select: ['region'] });
  }

  getAllZipCodes() {
    return this.zipCodeRepository.find({ select: ['zipcode'] });
  }

  matchZipCodesByRegion(region: string) {
    return this.zipCodeRepository.find({
      where: {
        region: {
          $regex: new RegExp(region, 'i'),
        },
      },
      take: limit,
    });
  }

  matchZipCodesByZipCode(zipCode: string) {
    return this.zipCodeRepository.find({
      where: {
        zipcode: {
          $regex: new RegExp(zipCode, 'i'),
        },
      },
      take: limit,
    });
  }

  validateZipCode(zipCode: string) {
    //check if the zipcode exists
    const found = this.zipCodeRepository.findOne({
      where: {
        zipcode: zipCode,
      },
    });
    return {
      valid: !!found,
      zip: found || null,
    };
  }
}
