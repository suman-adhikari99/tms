import { Controller, Get, Param } from '@nestjs/common';
import { EditableSectionsService } from './editable-sections.service';

@Controller('editable-sections')
export class EditableSectionsController {
    constructor(private editableSectionService: EditableSectionsService) { }

    @Get()
    getAllEditableSections() {
        return this.editableSectionService.getAllEditableSections();
    }

    @Get('/:serviceId')
    getEditableSectionByServiceId(@Param('serviceId') serviceId: string) {
        return this.editableSectionService.getEditableSectionByServiceId(serviceId);
    }
}
