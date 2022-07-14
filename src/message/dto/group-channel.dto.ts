import { IsArray, IsString } from 'class-validator';

export class GroupChannelDto {
    @IsString()
    channel: string;

    @IsArray()
    groupmembers: string[];

    @IsArray()
    seen: string[];
}
