import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

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
      email: ['', Validators.required],
      phone: [''],
      invoiceNumber: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      invoiceDate: ['', Validators.required]
    });
  }

  onSubmit(){
    console.log(123);

  }
}
