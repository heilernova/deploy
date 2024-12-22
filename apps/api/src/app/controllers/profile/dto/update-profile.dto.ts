import { IsEmail, IsString, MaxLength } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsEmail()
    @MaxLength(100)
    email: string;
}