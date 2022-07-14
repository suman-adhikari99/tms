import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectClosureDto } from './create-project-closure.dto';

export class UpdateProjectClosureDto extends PartialType(CreateProjectClosureDto) {}
