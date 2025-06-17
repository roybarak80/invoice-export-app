import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphanumericValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /^[a-zA-Z0-9]*$/.test(control.value) ? null : { alphanumeric: true };
}

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const digitsOnly = value.replace(/\D/g, '');
  const validChars = /^[0-9\s\-\+\(\)]+$/;
  const validDigits = (digitsOnly.length < 7 || digitsOnly.length > 15);

  if (((digitsOnly.length < 7 || digitsOnly.length > 15) ) && validChars.test(value)) return { phone: true };

  return null;
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
