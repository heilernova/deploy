import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer'
import { DrawerUserMenuComponent } from '../ui/drawer-user-menu/drawer-user-menu.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    NzDrawerModule,
    NzButtonModule,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly _nzDrawerService = inject(NzDrawerService);
  private readonly _auth = inject(AuthService);
  private readonly _config = inject(ConfigService);

  public readonly user = signal<string>("");
  public readonly version = this._config.version;

  constructor(){
    this.user.set(this._auth.getSession()?.name ?? "");
  }

  protected openDrawerUserMenu(): void {
    this._nzDrawerService.create({
      nzTitle: this.user(),
      nzContent: DrawerUserMenuComponent,
    })
  }
}

