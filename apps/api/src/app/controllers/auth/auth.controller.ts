import { Body, Controller, Headers, HttpException, Ip, Post, UseGuards } from '@nestjs/common';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { ApiAuth } from '@deploy/schemas/auth';
import { verify } from 'argon2';
import { UAParser } from 'ua-parser-js';
import { UsersService } from '@deploy/api/models/users';
import { TokensService } from '@deploy/api/models/tokens';
import { CredentialsDto } from './dto';
import { AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';

@Controller()
export class AuthController {

    constructor(private readonly _users: UsersService, private readonly _tokens: TokensService){}

    @Post('sign-in')
    async signIn(@Body() credentials: CredentialsDto, @Ip() ip: string, @Headers("user-agent") userAgentString: string, @Headers("x-app-hostname") hostname: string ): Promise<ApiResponseWithData<ApiAuth>>  {
        const user = await this._users.get(credentials.username);
        if (!user){
            throw new HttpException("Usuario incorrecto.", 400);
        }
        
        const passwordValid = await verify(user.password, credentials.password);

        if (!passwordValid){
            throw new HttpException("Contraseña incorrecta", 400);
        }

        const userAgent = new UAParser(userAgentString);
        let exp: Date | null = null;
        const cli = userAgent.getBrowser().name ? false : true;

        if (!cli){
            exp = new Date();
            exp.setHours(exp.getHours() + 8);
        }

        const token = await this._tokens.create({ 
            userId: user.id,
            type: cli ? "cli" : "web",
            hostname: hostname ?? "website",
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

    @UseGuards(AuthGuard)
    @Post("keep-session-open")
    async keepSessionOpen(@Authenticated() session: AppSession){
        await session.keepSessionOpen();
    }
}
