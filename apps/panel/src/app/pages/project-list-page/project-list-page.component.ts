import { Component, inject, OnInit, signal } from '@angular/core';
import { Project } from '@deploy/panel/data/projects/project';
import { ProjectsDataSourceService } from '@deploy/panel/data/projects/projects-data-source.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-project-list-page',
  imports: [
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './project-list-page.component.html',
  styleUrl: './project-list-page.component.scss'
})
export class ProjectListPageComponent implements OnInit {
  private readonly _projectsDataSource = inject(ProjectsDataSourceService);
  protected readonly list = signal<Project[]>([]);
  
  ngOnInit(): void {
    this._projectsDataSource.getAll().then(list => {
      this.list.set(list);
    })
  }
}
