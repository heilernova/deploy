import { AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';
import { DbUser, UsersService } from '@deploy/api/models/users';
import { Body, Controller, Delete, Get, HttpException, Param, Put, UseGuards } from '@nestjs/common';
import { UpdatePasswordDto, UpdateProfileDto } from './dto';
import { ApiResponse, ApiResponseWithData } from '@deploy/schemas/api';
import { UserRole } from '@deploy/schemas/users';
import { verify } from 'argon2';
import { TokensService } from '@deploy/api/models/tokens';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {

    constructor(private readonly _users: UsersService, private readonly _tokens: TokensService){}

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

    @Get("access-tokens")
    async getAccessTokens(@Authenticated() session: AppSession){
        const list = (await this._tokens.getAll({ userId: session.id }))
        .map(token => {
            return {
                id: token.id,
                createdAt: token.createdAt.toISOString(),
                type: token.type,
                hostname: token.hostname,
                ip: token.ip,
                device: token.device,
                platform: token.platform,
                exp: token.exp ? token.exp.toISOString() : null
            }
        });

        const index = list.findIndex(x => x.id === session.token);

        if (index > -1){
            const token = list.splice(index, 1)[0];
            list.unshift(token);
        }

        return {
            data: list
        };
    }

    @Delete("access-tokens/:id")
    async deleteAccessTokens(@Param("id") id: string){
        await this._tokens.delete(id);
        return {}
    }
}
