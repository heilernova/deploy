import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';

export const GetSession = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request&{ appSession: any }>();
        if (!request.appSession){
            throw new HttpException('No se cargo correctamente la información de la sesión', 500);
        }
        return request.appSession;
    },
);