import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { isUUID } from 'class-validator';
import { getService } from '@deploy/api/utils/get-service';
import { TokensService } from '@deploy/api/models/tokens';
import { AppSession } from './app-session';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = request.headers["x-app-token"];
    const tokensService = await getService(TokensService);

    
    if (typeof token !== "string" || !isUUID(token)){
      throw new HttpException("Formato del token invalido", 401);
    }

    const tokenAuth = await tokensService.verify(token);

    if (!tokenAuth){
      throw new HttpException("Token invalido", 401);
    }

    if (tokenAuth.exp && tokenAuth.exp < (new Date())){
      throw new HttpException("El token de acceso ha expirado", 403);
    }

    request["appToken"] = new AppSession({ ...tokenAuth, token });

    return true;
  }
}
