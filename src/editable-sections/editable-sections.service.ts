import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditableSectionRepository } from './editable-section.repository';

@Injectable()
export class EditableSectionsService {
    constructor(@InjectRepository(EditableSectionRepository) private editableSection: EditableSectionRepository) { }

    getAllEditableSections() {
        return this.editableSection.find();
    }

    async getEditableSectionByServiceId(id: string) {
        try {
            const editSection = await this.editableSection.find({
                where: {
                    serviceId: id
                }
            })
            if (!editSection) {
                throw new NotFoundException('Editable Section with given service id Not Found');
            } else {
                return editSection;
            }
        } catch {
            throw new NotFoundException('Editable Section Not Found');
        }
    }
}
