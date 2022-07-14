import { EntityRepository, Repository } from "typeorm";
import { EditableSection } from "./editable-section.entity";

@EntityRepository(EditableSection)
export class EditableSectionRepository extends Repository<EditableSection>{ }