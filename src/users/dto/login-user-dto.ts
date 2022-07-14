import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    rememberMe: boolean;
}
