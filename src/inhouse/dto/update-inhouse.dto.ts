import { PartialType } from '@nestjs/mapped-types';
import { CreateInhouseDto } from './create-inhouse.dto';

export class UpdateInhouseDto extends PartialType(CreateInhouseDto) {}
