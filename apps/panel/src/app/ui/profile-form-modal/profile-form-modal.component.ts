import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { markAllAsDirty } from '@deploy/panel/utils/mark-all-as-dirty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-profile-form-modal',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './profile-form-modal.component.html',
  styleUrl: './profile-form-modal.component.scss'
})
export class ProfileFormModalComponent {
  private readonly _nzModalRef = inject(NzModalRef);
  private readonly _nzMessage = inject(NzMessageService);
  private readonly _http = inject(HttpClient);

  public readonly loading = signal<boolean>(false);

  public readonly form = new FormGroup({
    name: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.email] }),
  })
  constructor(@Inject(NZ_MODAL_DATA) data: { name: string, email: string }){
    this.form.setValue({
      name: data.name,
      email: data.email
    });

    this.form.statusChanges.subscribe(status => {
      this.loading.set( status == "DISABLED");
    })
  }

  onClose(): void {
    this._nzModalRef.destroy();
  }

  onSave(): void {
    if (this.form.invalid){
      markAllAsDirty(this.form);
      return;
    }

    const values = this.form.getRawValue();
    this.form.disable();
    const config = this._nzModalRef.getConfig();
    config.nzClosable = false;
    config.nzMaskClosable = false;


    this._http.put("profile", values).subscribe({
      next: () => {
        this._nzMessage.success("Datos actualizados correctamente.")
        this._nzModalRef.destroy(values);
      },
      error: () => {
        this._nzMessage.error("No se pudo actualizar la información.");
        this.form.enable();
        config.nzClosable = true;
        config.nzMaskClosable = true;
      }
    })
  }
}
