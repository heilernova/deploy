import { IsString, MaxLength } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @MaxLength(30)
    password: string;

    @IsString()
    @MaxLength(30)
    newPassword: string;
}