import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { UserRole } from '@deploy/schemas/users';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-profile-info',
  imports: [
    NzButtonModule
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent implements OnInit {
  public readonly data = signal<{ role: UserRole, name: string, email: string } | null>(null);
  private readonly _http = inject(HttpClient);
  ngOnInit(): void {
    this._http.get<ApiResponseWithData<{ role: UserRole, name: string, email: string }>>("profile").subscribe({
      next: res => {
        this.data.set(res.data);
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
