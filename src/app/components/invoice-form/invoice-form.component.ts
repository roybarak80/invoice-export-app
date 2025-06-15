import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';
import { alphanumericValidator, phoneValidator, positiveNumberValidator } from '../../utils/validators';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InvoiceService, Invoice } from '../../services/invoice.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SignaturePadComponent,
    MatButtonModule,
    MatSnackBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent implements OnInit {
  form!: FormGroup;
  signatureProvided = false;
  isSubmitting = false;
  @ViewChild(SignaturePadComponent) signaturePadComponent!: SignaturePadComponent;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {}

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

  onSignatureProvided(valid: boolean): void {
    this.signatureProvided = valid;
    this.cdr.markForCheck();
  }

  clearSignature(): void {
    this.signaturePadComponent.clear();
    this.signatureProvided = false;
    this.cdr.markForCheck();
  }

  resetForm(){
   this.form.reset();
   this.form.markAsPristine();
   this.form.markAsUntouched();
   Object.keys(this.form.controls).forEach(key => {
     this.form.get(key)?.setErrors(null);
   });
   this.signaturePadComponent.clear();
   this.signatureProvided = false;
   this.cdr.markForCheck();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || !this.signatureProvided) {
      this.form.markAllAsTouched();
      this.snackBar.open('Please fill all required fields and provide a signature.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.cdr.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    try {
      const formData: Invoice = {
        ...this.form.value,
        signature: this.signaturePadComponent.getSignatureImage() || ''
      };

      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text('Invoice Details', 10, 10);
      pdf.setFontSize(12);
      pdf.text(`Full Name: ${formData.fullName}`, 10, 20);
      pdf.text(`Email: ${formData.email}`, 10, 30);
      pdf.text(`Phone: ${formData.phone || 'N/A'}`, 10, 40);
      pdf.text(`Invoice Number: ${formData.invoiceNumber}`, 10, 50);
      pdf.text(`Amount: ${formData.amount}`, 10, 60);
      pdf.text(`Invoice Date: ${new Date(formData.invoiceDate).toLocaleDateString()}`, 10, 70);

      if (formData.signature) {
        pdf.text('Signature:', 10, 80);
        pdf.addImage(formData.signature, 'PNG', 10, 85, 100, 40);
      }

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        this.snackBar.open('Popup blocked. Please allow popups or download manually.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }

      await this.invoiceService.submitInvoice(formData).toPromise();
      await this.invoiceService.submitPdf(pdfBlob, formData).toPromise();

      this.snackBar.open('Invoice submitted successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.resetForm();

    } catch (error: any) {
      this.snackBar.open(error.message || 'Submission failed. Please try again or contact support.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }
}
