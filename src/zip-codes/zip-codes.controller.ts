import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZipCodesService } from './zip-codes.service';

@Controller('zip-codes')
export class ZipCodesController {
  constructor(private zipCodeService: ZipCodesService) {}

  @Get()
  getAllData(@Query('limit') limit: string, @Query('skip') skip: string) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    return this.zipCodeService.getAllData(limitNum, skipNum);
  }

  @Get('/regions')
  getAllRegions() {
    return this.zipCodeService.getAllRegions();
  }

  @Get('/zipcodes')
  getAllZipCodes() {
    return this.zipCodeService.getAllZipCodes();
  }

  @Get('/regions/:region')
  matchZipCodesByRegion(@Param('region') region: string) {
    return this.zipCodeService.matchZipCodesByRegion(region);
  }

  @Get('/zipcodes/:zipcode')
  matchZipCodesByZipCode(@Param('zipcode') zipCode: string) {
    return this.zipCodeService.matchZipCodesByZipCode(zipCode);
  }

  @Get('/validate/:zipcode')
  validateZipCode(@Param('zipcode') zipCode: string) {
    return this.zipCodeService.validateZipCode(zipCode);
  }
}
