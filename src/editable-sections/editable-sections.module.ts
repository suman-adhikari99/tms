import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditableSectionRepository } from './editable-section.repository';
import { EditableSectionsController } from './editable-sections.controller';
import { EditableSectionsService } from './editable-sections.service';

@Module({
  imports: [TypeOrmModule.forFeature([EditableSectionRepository])],
  controllers: [EditableSectionsController],
  providers: [EditableSectionsService]
})
export class EditableSectionsModule { }
