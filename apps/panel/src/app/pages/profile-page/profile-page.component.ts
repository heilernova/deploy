import { Component, inject } from '@angular/core';
import { AuthService } from '@deploy/panel/auth/auth.service';
import { AccessTokensComponent } from '@deploy/panel/ui/access-tokens/access-tokens.component';
import { ProfileInfoComponent } from '@deploy/panel/ui/profile-info/profile-info.component';
import { ProfileSecurityComponent } from '@deploy/panel/ui/profile-security/profile-security.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileInfoComponent,
    ProfileSecurityComponent,
    AccessTokensComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private readonly _auth = inject(AuthService);
  

  constructor(){
    // this.session.set(this._auth.getSession());
  }
}
