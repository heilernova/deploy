import { Component, effect, inject, input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule  } from 'ng-zorro-antd/select';
import { EnvControlComponent } from '../env-control/env-control.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Framework, RunningOn, RuntimeEnvironment } from '@deploy/schemas/projects';
import { markAllAsDirty } from '@deploy/panel/utils/mark-all-as-dirty';
import { Project } from '@deploy/panel/data/projects/project';
import { ProjectsDataSourceService } from '@deploy/panel/data/projects/projects-data-source.service';

@Component({
  selector: 'app-project-form',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    EnvControlComponent
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  private readonly _projectsDataSource = inject(ProjectsDataSourceService);
  protected readonly formGroup = new FormGroup({
    domain: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    name: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    processName: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    location: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    startupFile: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    framework: new FormControl<Framework | null>(null),
    runningOn: new FormControl<RunningOn | null>(null),
    runtimeEnvironment: new FormControl<RuntimeEnvironment | null>(null),
    ignore: new FormControl<string[]>([]),
    env: new FormControl<{ key: string, value: string }[]>([], { nonNullable: true, validators: Validators.required })
  })

  constructor(){
    effect(() => {
      const product = this.product();
      if (product){
        const env: { key: string, value: string }[] = []
        Object.entries(product.env).forEach(item => {
          env.push({ key: item[0], value: item[1] });
        })
        this.formGroup.setValue({
          domain: product.domain ?? "",
          name: product.name ?? "",
          processName: product.processName ?? "",
          framework: product.framework ?? null,
          runningOn: product.runningOn ?? null,
          runtimeEnvironment: product?.runtimeEnvironment ?? null,
          location: product.location ?? "",
          ignore: product.ignore ?? [],
          startupFile: product?.startupFile ?? "",
          env: env
        });
      }
    })
  }

  public readonly product = input<Project>()

  public valid(){
    const valid = this.formGroup.valid;
    if (!valid) markAllAsDirty(this.formGroup);
    return valid;
  }

  public invalid(){
    const invalid = this.formGroup.invalid;
    if (invalid){
      markAllAsDirty(this.formGroup);
    }
    return invalid;
  }

  public getRawValue(){
    const values = this.formGroup.getRawValue();
    const env: { [key: string]: string } = {};
    values.env.forEach(item => {
      env[item.key] = item.value
    })

    return {
      domain: values.domain,
      name: values.name,
      processName: values.processName,
      location: values.location,
      startupFile: values.startupFile,
      framework: values.framework,
      runningOn: values.runningOn,
      runtimeEnvironment: values.runtimeEnvironment,
      ignore: values.ignore,
      env: env
    }
  }

  public onSave(): Promise<Project> {
    return new Promise((resolve, reject) => {

      if (this.invalid()){
        reject(new Error("Faltan campos por completar."));
        return;
      }

      const project = this.product();
      const values = this.getRawValue();
      if (project){
        this._projectsDataSource.update(project.id, values)
        .then(() => {
          resolve(project)
        })
        .catch(err => reject(err))
      } else {
        this._projectsDataSource.create(values)
        .then(res => resolve(res))
        .catch(err => reject(err))
      }
    })
  }
}
