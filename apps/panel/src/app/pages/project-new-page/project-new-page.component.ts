import { Component, inject, ViewChild } from '@angular/core';
import { ProjectsDataSourceService } from '@deploy/panel/data/projects/projects-data-source.service';
import { ProjectFormComponent } from '@deploy/panel/ui/project-form/project-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-project-new-page',
  imports: [
    ProjectFormComponent,
    NzButtonModule
  ],
  templateUrl: './project-new-page.component.html',
  styleUrl: './project-new-page.component.scss'
})
export class ProjectNewPageComponent {
  private readonly _projectsDataSource = inject(ProjectsDataSourceService);
  private readonly _nzMessage = inject(NzMessageService);
  @ViewChild(ProjectFormComponent) form!: ProjectFormComponent;

  onClickSave(): void {
    if (this.form.invalid()){
      this._nzMessage.warning("Faltan campos por completar.");
      return;
    }

    const value = this.form.getRawValue();
    this._projectsDataSource.create(value)
    .then(() => {
      this._nzMessage.success("Proyecto registrado.");
    })
    .catch(() => {
      this._nzMessage.error("No se pudo registrar el proyecto.");
    })
  }
}
