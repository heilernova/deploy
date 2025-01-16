import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '@deploy/panel/auth/auth.service';
import { Router } from '@angular/router';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly _auth = inject(AuthService);
  private readonly _message = inject(NzMessageService);
  private readonly _modal = inject(NzModalService);
  private readonly _router = inject(Router);

  protected readonly credentials = new FormGroup({
    username: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    password: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
  });

  protected readonly disableButtonSignIn = signal<boolean>(true);

  constructor(){
    this.credentials.statusChanges.subscribe(status => this.disableButtonSignIn.set(status !== "VALID"));
  }

  protected onClickSignIn(): void {
    if (this.credentials.invalid){
      this._message.warning("Falta campos por completar.");
      return;
    }

    const credentials = this.credentials.getRawValue();
    this.credentials.disable();
    this._auth.signIn(credentials)
    .then(() => {
      this._router.navigate(["/"]);
      this._modal.confirm({
        nzTitle: "Bienvenido.",
        nzContent: "¿Sea mantener la sesión abierta?",
        nzOnOk: () => {
          this._auth.keepSessionOpen();
        }
      })
    })
    .catch(err => {
      this._message.warning(err.error.message);
      this.credentials.enable();
    })

  }
}
