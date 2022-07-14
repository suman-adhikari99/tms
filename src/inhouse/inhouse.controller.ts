import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { InhouseService } from './inhouse.service';
import { CreateInhouseDto } from './dto/create-inhouse.dto';
import { UpdateInhouseDto } from './dto/update-inhouse.dto';

@Controller('inhouseGroup')
export class InhouseController {
  constructor(private readonly inhouseService: InhouseService) {}

  @Post()
  create(@Body() createInhouseDto: CreateInhouseDto) {
    return this.inhouseService.create(createInhouseDto);
  }

  @Get()
  findAll() {
    return this.inhouseService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.inhouseService.findOne(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateInhouseDto: UpdateInhouseDto) {
    return this.inhouseService.update(id, updateInhouseDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.inhouseService.remove(id);
  }
}
