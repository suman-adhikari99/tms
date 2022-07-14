import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Post()
  create(@Body() createContractorDto: CreateContractorDto) {
    return this.contractorService.create(createContractorDto);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.contractorService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() updateContractorDto: UpdateContractorDto,
  ) {
    return this.contractorService.update(id, updateContractorDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.contractorService.remove(id);
  }

  @Get()
  findAll() {
    return this.contractorService.findAll();
  }
}
