import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdatePasswordModalComponent } from '../update-password-modal/update-password-modal.component';

@Component({
  selector: 'app-profile-security',
  imports: [
    NzButtonModule
  ],
  templateUrl: './profile-security.component.html',
  styleUrl: './profile-security.component.scss'
})
export class ProfileSecurityComponent {
  private readonly _modal = inject(NzModalService);

  protected onClickOpenModal(): void {
    this._modal.create({
      nzTitle: "Actualizar contraseña",
      nzContent: UpdatePasswordModalComponent,
    })
  }
}
