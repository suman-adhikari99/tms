import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { TeamMember } from 'src/projects/interfaces';

export class AddTeamMemberDto {
  @IsOptional()
  @IsArray()
  teamMember: TeamMember[];

  // @IsString()
  // projectId: string;

  // @IsString()
  // id: string;

  // @IsString()
  // name: string;

  // @IsString()
  // imageUrl: string;

  // @IsString()
  // role: string;
}
