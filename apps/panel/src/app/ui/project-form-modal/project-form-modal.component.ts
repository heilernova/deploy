import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-form-modal',
  imports: [
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ProjectFormComponent
  ],
  templateUrl: './project-form-modal.component.html',
  styleUrl: './project-form-modal.component.scss'
})
export class ProjectFormModalComponent {

}
