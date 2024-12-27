import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@deploy/panel/data/projects/project';
import { ProjectsDataSourceService } from '@deploy/panel/data/projects/projects-data-source.service';
import { ProjectFormModalComponent } from '@deploy/panel/ui/project-form-modal/project-form-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-project-list-page',
  imports: [
    NzInputModule,
    NzButtonModule,
    NzModalModule,
    RouterLink
  ],
  templateUrl: './project-list-page.component.html',
  styleUrl: './project-list-page.component.scss'
})
export class ProjectListPageComponent implements OnInit {
  private readonly _projectsDataSource = inject(ProjectsDataSourceService);
  private readonly _nzModal = inject(NzModalService);
  protected readonly list = signal<Project[]>([]);
  
  ngOnInit(): void {
    this._projectsDataSource.getAll().then(list => {
      this.list.set(list);
    })
  }

  protected onClickOpen(): void {
    this._nzModal.create({
      nzTitle: "Registrar proyecto",
      nzContent: ProjectFormModalComponent
    })
  }
}
