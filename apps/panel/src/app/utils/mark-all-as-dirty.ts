import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

export const markAllAsDirty = (control: AbstractControl): void => {
  if (control instanceof FormControl) {
    control.markAsDirty();
    control.updateValueAndValidity({ onlySelf: true });
  } else if (control instanceof FormGroup || control instanceof FormArray) {
    Object.values(control.controls).forEach(x => markAllAsDirty(x));
  }
};
  