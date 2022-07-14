import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DeductionsService } from './deductions.service';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';

@Controller('deductions')
export class DeductionsController {
  constructor(private readonly deductionsService: DeductionsService) {}

  @Post()
  create(@Body() createDeductionDto: CreateDeductionDto) {
    return this.deductionsService.create(createDeductionDto);
  }

  @Get()
  findAll() {
    return this.deductionsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.deductionsService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() updateDeductionDto: UpdateDeductionDto,
  ) {
    return this.deductionsService.update(id, updateDeductionDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.deductionsService.remove(id);
  }
}
