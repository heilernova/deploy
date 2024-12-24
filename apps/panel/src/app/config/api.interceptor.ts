import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const url = `${environment.API_URL_BASE}/${req.url}`;
  let headers = req.headers;

  const session = auth.getSession();
  if (session){
    headers = headers.append("X-App-Token", session.token);
  }

  return next(req.clone({ url, headers }));
};
