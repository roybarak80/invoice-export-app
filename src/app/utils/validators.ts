import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphanumericValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /^[a-zA-Z0-9]*$/.test(control.value) ? null : { alphanumeric: true };
}

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /^[0-9\-\+\s\(\)]{7,15}$/.test(control.value) ? null : { phone: true };
}

export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null || value === '' || value === 0) {
      return null;
    }
    return value > 0 ? null : { positiveNumber: true };
  };
}
