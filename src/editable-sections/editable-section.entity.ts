import { Transform } from "class-transformer";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity({ name: 'editable-sections' })
export class EditableSection {
    @ObjectIdColumn()
    @Transform(({ value }) => value.toString())
    id: string;

    @Column()
    serviceId: string;

    @Column()
    editableSections: string[];
}