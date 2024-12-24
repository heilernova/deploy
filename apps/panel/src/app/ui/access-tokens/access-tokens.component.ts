import { Component, inject, signal } from '@angular/core';
import { AccessTokensDataSourceService } from '@deploy/panel/data/access-tokens/access-tokens-data-source.service';
import { IAccessToken } from '@deploy/panel/data/access-tokens/access-token.interface';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-access-tokens',
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './access-tokens.component.html',
  styleUrl: './access-tokens.component.scss'
})
export class AccessTokensComponent {
  private readonly _accessTokens = inject(AccessTokensDataSourceService);
  private readonly _modal = inject(NzModalService);
  private readonly _message = inject(NzMessageService);

  protected readonly list = signal<IAccessToken[]>([]);

  constructor(){
    this._accessTokens.getAll().then(list => this.list.set(list));
  }

  protected onClickDeleteToken(id: string): void {
    this._modal.confirm({
      nzTitle: "¿Eliminar token de acceso?",
      nzOnOk: () => {
        this._accessTokens.delete(id).then(() => {

          this.list.update(list => {
            const index = list.findIndex(x => x.id == id);
            if (index > -1){

              list.splice(index, 1);
            }
            return list;
          })

          this._message.success("Token eliminado.");
        })
      }
    })
  }
}
