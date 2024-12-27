import { Component, ElementRef, Optional, Self } from '@angular/core';
import { AbstractControlDirective, ControlValueAccessor, FormArray, FormControl, FormGroup, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-env-control',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './env-control.component.html',
  styleUrl: './env-control.component.scss'
})
export class EnvControlComponent implements ControlValueAccessor {
  
  protected readonly formArray = new FormArray<FormGroup<{ key: FormControl<string>, value: FormControl<string> }>>([]);
  public disable = false;
  public ngControl: NgControl | AbstractControlDirective | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public onChange = (_: { key: string, value: string }[]) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};

  constructor(
    // private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() ngControl: NgControl
  ){
    if (ngControl){
      ngControl.valueAccessor = this;
      this.ngControl = ngControl;
    }

    this.formArray.valueChanges.subscribe(value => {
      const list = value.map(item => ({ key: item.key?.toUpperCase() ?? "", value: item.value ?? "" }))
      this.onChange(list);
    })
  }
  
  protected onClickAdd(): void {
    this.formArray.push(new FormGroup({
      key: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
      value: new FormControl<string>("", { nonNullable: true, validators: Validators.required })
    }))
  }

  protected onClickDelete(index: number): void {
    this.formArray.removeAt(index);
  }


  writeValue(obj: { key: string, value: string }[]): void {

    obj.forEach(item => {
      this.formArray.push(new FormGroup({
        key: new FormControl<string>(item.key, { nonNullable: true, validators: Validators.required }),
        value: new FormControl<string>(item.value, { nonNullable: true, validators: Validators.required })
      }))
    })
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }
}
