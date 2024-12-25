import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { Project } from './project';
import { ApiProject } from '@deploy/schemas/projects';


@Injectable({
  providedIn: 'root'
})
export class ProjectsDataSourceService {
  private readonly _http = inject(HttpClient);
  public getAll(): Promise<Project[]>{
    return new Promise((resolve, reject) => {
      this._http.get<ApiResponseWithData<ApiProject[]>>("projects").subscribe({
        next: res => {
          resolve(res.data.map(x => new Project(x)));
        },
        error: err => reject(err)
      })
    })
  }
}
