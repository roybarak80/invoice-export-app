import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { alphanumericValidator, phoneValidator, positiveNumberValidator } from '../../utils/validators';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder){

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', phoneValidator],
      invoiceNumber: ['', [Validators.required, alphanumericValidator]],
      amount: ['', [Validators.required, positiveNumberValidator]],
      invoiceDate: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid ) {
      this.form.markAllAsTouched();
      return;
    }

    alert('sucess')
  }
}
