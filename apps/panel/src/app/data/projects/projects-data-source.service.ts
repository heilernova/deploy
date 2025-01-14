import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { Project } from './project';
import { ApiProject, ProjectStatus } from '@deploy/schemas/projects';
import { definePropertiesOnObject } from '@deploy/core';


@Injectable({
  providedIn: 'root'
})
export class ProjectsDataSourceService {
  private readonly _http = inject(HttpClient);
  private _list: Project[] = [];
  
  public getAll(): Promise<Project[]>{
    return new Promise((resolve, reject) => {

      if (this._list.length > 0){
        resolve(this._list);
        return;
      }

      this._http.get<ApiResponseWithData<ApiProject[]>>("projects").subscribe({
        next: res => {
          this._list = res.data.map(x => new Project(x));
          resolve(this._list);
        },
        error: err => reject(err)
      })
    })
  }

  public get(id: string): Promise<Project> {
    return new Promise((resolve, reject) => {

      this.getAll()
      .then(list => {
        const result = list.find(x => x.id == id);
        if (result){
          resolve(result)
        } else {
          reject(new Error("Producto no encontrado"));
        }
      })
      .catch(err => reject(err))
    })
  }

  public update(id: string, data: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      this._http.put<ApiResponseWithData<ApiProject>>(`projects/${id}`, data).subscribe({
        next: res => {
          let project = this._list.find(x => x.id == id);
          if (!project){
            project = new Project(res.data);
          } else {
            definePropertiesOnObject(project, res.data);
          }
          resolve();
        },
        error: err => reject(err)
      })
    })
  }

  public create(data: unknown): Promise<Project> {
    return new Promise((resolve, reject) => {
      this._http.post<ApiResponseWithData<ApiProject>>("projects", data).subscribe({
        next: res => {
          const project = new Project(res.data);
          this._list.push(project);
          resolve(new Project(res.data));
        },
        error: err =>  reject(err)
      })
    })
  }

  public launch(id: string): Promise<ProjectStatus>{
    return new Promise((resolve, reject) => {
      this._http.post<ApiResponseWithData<ProjectStatus>>(`projects/${id}/launch`, undefined).subscribe({
        next: res => {
          resolve(res.data);
        },
        error: err => reject(err)
      })
    })
  }

  public stop(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._http.post<void>(`projects/${id}/stop`, undefined).subscribe({
        next: () => {
          resolve()
        },
        error: err => reject(err)
      })
    })
  }
}
