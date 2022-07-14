import { IsBoolean } from "class-validator";

export class EditNotification{
    @IsBoolean()
    hasRead: boolean;
}