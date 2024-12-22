import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'
import { UsersService } from '../models/users';
import { AppModule } from '../app.module';
import { AppSession } from './auth.modal';

export const Authenticated = createParamDecorator(
    async (data: "user" | "token" | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request&{ appSession: AppSession }>();
        if (!(request.appSession instanceof AppSession)){
            throw new HttpException('No se cargo correctamente la información de la sesión', 500);
        }

        if (data == "user"){
            const appContext = await NestFactory.createApplicationContext(AppModule);
            const userService = appContext.get(UsersService);
            return  await userService.get(request.appSession.id);
        }

        return request.appSession;
    },
);