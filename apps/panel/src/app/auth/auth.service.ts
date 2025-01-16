import { inject, Injectable } from '@angular/core';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { ApiAuth } from '@deploy/schemas/auth';
import { Session } from './session';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _session: Session | null = null;
  private readonly _http = inject(HttpClient);

  public init(): void {
    const token =  localStorage.getItem("app-token");
    if (token){
      const data: ApiAuth | null = JSON.parse(window.atob(token));
      if (data){
        this._session = new Session(data);
      }
    }
    return;
  }

  public getSession(): Session | null {
    return this._session;
  }

  public isLoggedIn(): boolean {
    return this._session !== null;
  }

  public signIn(credentials: { username: string, password: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      this._http.post<ApiResponseWithData<ApiAuth>>("sign-in", credentials).subscribe({
        next: res => {
          const session = new Session(res.data);
          localStorage.setItem("app-token", window.btoa(JSON.stringify(res.data)));
          this._session = session;
          resolve();
        },
        error: err => reject(err)
      })
    });
  }

  public keepSessionOpen(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._http.post("keep-session-open", undefined).subscribe({
        next: () => resolve(),
        error: err => reject(err)
      })
    })
  }

  public logout(): void {
    localStorage.removeItem("app-token");
    this._session = null;
  }
}
