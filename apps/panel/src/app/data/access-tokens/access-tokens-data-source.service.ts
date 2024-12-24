import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, ApiResponseWithData } from '@deploy/schemas/api';
import { ApiAccessToken } from '@deploy/schemas/tokens';
import { IAccessToken } from './access-token.interface';

@Injectable({
  providedIn: 'root'
})
export class AccessTokensDataSourceService {
  private readonly _http = inject(HttpClient);
  
  public getAll(): Promise<IAccessToken[]> {
    return new Promise((resolve, reject) => {
      this._http.get<ApiResponseWithData<ApiAccessToken[]>>("profile/access-tokens").subscribe({
        next: res => {
          resolve(res.data.map(item => {
            return {
              id: item.id,
              createdAt: new Date(item.createdAt),
              type: item.type,
              hostname: item.hostname,
              device: item.device,
              platform: item.platform,
              ip: item.id,
              exp: item.exp ? new Date(item.exp) : null
            }
          }))
        },
        error: err => reject(err)
      })
    })
  } 

  public delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._http.delete<ApiResponse>(`profile/access-tokens/${id}`).subscribe({
        next: () => {
          resolve();
        },
        error: err => reject(err)
      })
    })
  }
}
