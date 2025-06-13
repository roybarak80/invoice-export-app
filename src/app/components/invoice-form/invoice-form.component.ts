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
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent implements OnInit {
  form!: FormGroup;
  signatureProvided = false;
  pdfUrl?: string;
  @ViewChild(SignaturePadComponent) signaturePadComponent!: SignaturePadComponent;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

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

  onSignatureProvided(valid: boolean) {
    this.signatureProvided = valid;
  }

  clearSignature(){
    this.signaturePadComponent.clear();
  }
  async onSubmit(): Promise<void> {
    if (this.form.invalid || !this.signatureProvided) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    const signatureImage = this.signaturePadComponent.getSignatureImage();

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

    if (signatureImage) {
      pdf.text('Signature:', 10, 80);
      pdf.addImage(signatureImage, 'PNG', 10, 85, 100, 40);
    }

    const pdfBlob = pdf.output('blob');

    const pdfUrl = URL.createObjectURL(pdfBlob);
    this.cdr.detectChanges();
    window.open(pdfUrl);
    await this.sendToBackend(formData, pdfBlob);
  }

  private async sendToBackend(formData: any, pdfBlob: Blob): Promise<void> {
    try {
      // JSON data POST
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // PDF upload POST
      const formDataPayload = new FormData();
      formDataPayload.append('file', pdfBlob, 'invoice.pdf');

      await fetch('/api/invoices/upload-pdf', {
        method: 'POST',
        body: formDataPayload
      });

      alert('Invoice submitted successfully!');
      this.form.reset();
      this.form.markAsPristine();
      this.signaturePadComponent.clear();
      this.signatureProvided = false;
      this.pdfUrl = undefined;

    } catch (error) {
      alert('Submission failed. Please try again later or contact support.');
      console.error(error);
    }
  }
}
