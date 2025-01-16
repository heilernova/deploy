import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const nzMessage = inject(NzMessageService);
  const router = inject(Router);
  const url = `${environment.API_URL_BASE}/${req.url}`;
  let headers = req.headers;

  const session = auth.getSession();
  if (session){
    headers = headers.append("X-App-Token", session.token);
  }

  return next(req.clone({ url, headers })).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse){
        if (err.status == 401){
          nzMessage.error("Tú sesión ha espirado.");
          auth.logout();
          router.navigate(["/login"]);
        }
      }
      return throwError(() => err);
    })
  );
};
