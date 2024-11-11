import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { getConnection } from '@deploy/api/common/database';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    let request = context.switchToHttp().getRequest<Request>();
    let token: string | undefined = request.headers["x-app-token"];

    if (!token) throw new HttpException("No tienes accesos", 403);
    let conn = await getConnection();
    let result: { id: string, role: "admin" | "collaborator", email: string } | undefined = await conn.get("SELECT a.id, a.role, a.email FROM users_tokens b INNER JOIN users a ON a.id  = b.user_id where b.id = ?", [token]);
    if (!result) {
      throw new HttpException("Token invalido", 401);
    }

    request["appSession"] = {
      token,
      ...request
    }

    return true;
  }
}
