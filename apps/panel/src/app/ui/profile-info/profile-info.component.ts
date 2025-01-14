import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { UserRole } from '@deploy/schemas/users';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProfileFormModalComponent } from '../profile-form-modal/profile-form-modal.component';

@Component({
  selector: 'app-profile-info',
  imports: [
    NzButtonModule
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent implements OnInit {
  private readonly _nzModal = inject(NzModalService);
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

  protected edit(): void {
    const data = this.data();
    if (data){
      this._nzModal.create({
        nzTitle: "Editar información",
        nzData: { name: data.name , email: data.email },
        nzContent: ProfileFormModalComponent
      }).afterClose.subscribe((res: { name: string, email: string } | undefined) => {
        if (res){
          this.data.set({
            role: data.role,
            name: res.name,
            email: res.email
          });
        }
      })
    }
  }
}
