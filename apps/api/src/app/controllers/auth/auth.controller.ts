import { Body, Controller, Headers, HttpException, Ip, Post } from '@nestjs/common';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { ApiAuth } from '@deploy/schemas/auth';
import { verify } from 'argon2';
import { UAParser } from 'ua-parser-js';
import { UsersService } from '@deploy/api/models/users';
import { TokensService } from '@deploy/api/models/tokens';
import { CredentialsDto } from './dto';

@Controller()
export class AuthController {

    constructor(private readonly _users: UsersService, private readonly _tokens: TokensService){}

    @Post('sign-in')
    async signIn(@Body() credentials: CredentialsDto, @Ip() ip: string, @Headers("user-agent") userAgentString: string, @Headers("x-app-cli") cli?: string): Promise<ApiResponseWithData<ApiAuth>>  {
        const user = await this._users.get(credentials.username);
        console.log(user);
        if (!user){
            throw new HttpException("Usuario incorrecto.", 400);
        }
        
        const passwordValid = await verify(user.password, credentials.password);

        if (!passwordValid){
            throw new HttpException("Contraseña incorrecta", 400);
        }

        const userAgent = new UAParser(userAgentString);
        let exp: Date | null = null;

        if (cli){
            exp = new Date();
            exp.setTime(exp.getTime() + 5 * 60);
        }

        const token = await this._tokens.create({ 
            userId: user.id,
            type: cli ? "cli" : "web",
            hostname: "website",
            ip: ip,
            device: userAgent.getDevice().type ?? "desktop",
            exp,
            platform: userAgent.getOS().name  ?? null
        })

        return {
            data: {
                role: user.role,
                name: user.name,
                token: token.id,
            }
        }
    }
}
