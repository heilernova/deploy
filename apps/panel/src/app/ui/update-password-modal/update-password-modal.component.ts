import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse } from '@deploy/schemas/api';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-password-modal',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzButtonModule
  ],
  templateUrl: './update-password-modal.component.html',
  styleUrl: './update-password-modal.component.scss'
})
export class UpdatePasswordModalComponent {
  private readonly _http = inject(HttpClient);
  private readonly _nzModalRef = inject(NzModalRef);
  private readonly _nzMessage = inject(NzMessageService);

  protected formGroup = new FormGroup({
    password: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
  })
  
  protected onClickSave(): void {

    if (this.formGroup.invalid){
      this._nzMessage.warning("Faltan campos por completar.");
      return;
    }

    const formValue = this.formGroup.getRawValue();
    this._nzModalRef.getConfig().nzMaskClosable = false;
    this._nzModalRef.getConfig().nzClosable = false;
    
    this._http.put<ApiResponse>("profile/password", { password: formValue.password, newPassword: formValue.newPassword }).subscribe({
      next: res => {
        this._nzMessage.success("Contraseña actualiza.");
        this._nzModalRef.close();
      },
      error: () => {
        this._nzMessage.error("No se pudo actualizar la contraseña.");
        this._nzModalRef.getConfig().nzMaskClosable = true;
        this._nzModalRef.getConfig().nzClosable = true;
      }
    })


  }
}
