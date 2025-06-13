import { AbstractControl, ValidationErrors } from '@angular/forms';

export function alphanumericValidator(control: AbstractControl): ValidationErrors | null {
  return /^[a-zA-Z0-9]*$/.test(control.value) ? null : { alphanumeric: true };
}

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /^[0-9\-\+\s\(\)]{7,15}$/.test(control.value) ? null : { phone: true };
}

export function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
  return control.value >0 ? null : control.value ===0 ? { positiveNumber: false } : { positiveNumber: true };
}

