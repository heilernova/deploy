import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AddHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader("API-Version", "0.0.1");
    next();
  }
}
