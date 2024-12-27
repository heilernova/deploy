import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { definePropertiesOnObject } from '@deploy/core';
import { Project } from '@deploy/panel/data/projects/project';
import { ProjectsDataSourceService } from '@deploy/panel/data/projects/projects-data-source.service';
import { ProjectFormComponent } from '@deploy/panel/ui/project-form/project-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-project-view-page',
  imports: [
    NzButtonModule,
    ProjectFormComponent
  ],
  templateUrl: './project-view-page.component.html',
  styleUrl: './project-view-page.component.scss'
})
export class ProjectViewPageComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _projectsDataSource = inject(ProjectsDataSourceService);
  private readonly _nzMessage = inject(NzMessageService);

  public readonly disabled = signal<boolean>(false);
  protected project = signal<Project | null>(null);
  protected edit = signal<boolean>(false);

  @ViewChild(ProjectFormComponent)
  protected form!: ProjectFormComponent

  constructor(){
    this._activatedRoute.params.subscribe(params => {
      const id = params["id"];
      this._projectsDataSource.get(id)
      .then(res => {
        this.project.set(res);
      })
      .catch(() => {
        this._router.navigate(["/projects"]);
        this._nzMessage.error("Proyecto no encontrado.");
      })
    })
  }

  protected onClickEdit(): void {
    this.edit.set(true);
  }

  protected onClickDiscardChanges(): void {
    this.edit.set(false);
  }

  protected onClickSave(): void {
    this.form.onSave().then(() => {
      this._nzMessage.success("Datos actualizado.");
      this.edit.set(false);

    })
    .catch(() => {
      this._nzMessage.error("No se pudo actualizar la información.")
    })
  }

  protected onClickRestar(): void {
    const project = this.project();
    if (project){
      this.disabled.set(true);
      this._projectsDataSource.launch(project.id)
      .then(() => {
        this.disabled.set(false);
        this._nzMessage.success("Aplicación reiniciada.");
      })
      .catch(() => {
        this.disabled.set(false);
        this._nzMessage.error("No se pudo reiniciar la aplicación.");
      })
    }
  }

  protected onClickLunchOrStop(): void {
    const project = this.project();

    if (project){
      this.disabled.set(true);
      if (project.status == "online"){
        this._projectsDataSource.stop(project.id)
        .then(() => {
          this._nzMessage.success("Aplicación de detenida.");
          definePropertiesOnObject(project, { status: "stopped" })
          this.disabled.set(false);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse){
            this._nzMessage.error(err.error.message);
          } else {
            this._nzMessage.error("No se pudo detener la aplicación");
          }
          this.disabled.set(false);
        })
      } else {
        this._projectsDataSource.launch(project.id)
        .then(status => {
          definePropertiesOnObject(project, { status });
          this.disabled.set(false);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse){
            this._nzMessage.error(err.error.message);
          } else {
            this._nzMessage.error("No se puedo realizar la acción");
          }
          this.disabled.set(false);
        })
      }
    }
  }
}
