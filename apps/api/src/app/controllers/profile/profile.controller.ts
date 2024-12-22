import { Authenticated, AuthGuard } from '@deploy/api/auth';
import { DbUser, UsersService } from '@deploy/api/models/users';
import { Body, Controller, Get, HttpException, Put, UseGuards } from '@nestjs/common';
import { UpdatePasswordDto, UpdateProfileDto } from './dto';
import { ApiResponse, ApiResponseWithData } from '@deploy/schemas/api';
import { UserRole } from '@deploy/schemas/users';
import { verify } from 'argon2';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {

    constructor(private readonly _users: UsersService){}

    @Get()
    async getInfo(@Authenticated("user") user: DbUser): Promise<ApiResponseWithData<{ role: UserRole, name: string, email: string }>>{
        return {
            data: {
                role: user.role,
                name: user.name,
                email: user.email,
            }
        }
    }

    @Put()
    async update(@Authenticated("user") user: DbUser, @Body() body: UpdateProfileDto): Promise<void>{
        await this._users.update(user.id, body);
    }

    @Put(":password")
    async password(@Authenticated("user") user: DbUser, @Body() update: UpdatePasswordDto): Promise<ApiResponse> {
        if (!(await verify(user.password, update.password))){
            throw new HttpException("Tu contraseña es incorrecta.", 400);
        }
        this._users.update(user.id, { password: update.password })
        return {
            message: "Contraseña actualizada."
        }
    }
}
