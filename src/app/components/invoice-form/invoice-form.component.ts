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
import { InvoiceService } from '../../services/invoice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '../../interface/invoice.interface';
import { InvoiceHeaderComponent } from '../invoice-header/invoice-header.component';

// Import Miriam Libre font as a raw TTF file (place in src/assets/fonts)
const miriamLibreFontUrl = 'assets/fonts/MiriamLibre-Regular.ttf';

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
    MatSnackBarModule,
    InvoiceHeaderComponent
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

  resetForm() {
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

  // Helper function to load font file as base64
  async loadFontAsBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch font file: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      // Convert ArrayBuffer to base64
      const base64data = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      // Validate base64 string
      if (!/^[A-Za-z0-9+/=]+$/.test(base64data)) {
        throw new Error('Invalid base64 data for font file');
      }
      console.log('Base64 length:', base64data.length); // Debug: Log base64 length
      return base64data; // Return raw base64 string without data: prefix
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Font loading error: ${errorMessage}`);
    }
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

      // Load and add Miriam Libre font
      let fontLoaded = false;
      try {
        const fontBase64 = await this.loadFontAsBase64(miriamLibreFontUrl);
        pdf.addFileToVFS('MiriamLibre-Regular.ttf', fontBase64);
        pdf.addFont('MiriamLibre-Regular.ttf', 'MiriamLibre', 'normal');
        pdf.setFont('MiriamLibre');
        fontLoaded = true;
      } catch (error) {
        console.error('Error loading Hebrew font:', error);
        this.snackBar.open('Hebrew font failed to load, using fallback font.', 'Close', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        pdf.setFont('Arial'); // Fallback to Arial
      }

      // Header
      pdf.setFontSize(20);
      pdf.text('Invoice', 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Issued on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      pdf.setLineWidth(0.5);
      pdf.line(20, 35, 190, 35); // Horizontal line

      // Table with invoice details using jspdf-autotable
      autoTable(pdf, {
        startY: 40,
        head: [['Field', 'Details']],
        body: [
          ['Full Name', formData.fullName],
          ['Email', formData.email],
          ['Phone', formData.phone || 'N/A'],
          ['Invoice Number', formData.invoiceNumber],
          ['Amount', `$${formData.amount}`],
          ['Invoice Date', new Date(formData.invoiceDate).toLocaleDateString()]
        ],
        styles: {
          font: fontLoaded ? 'MiriamLibre' : 'Arial',
          fontSize: 10,
          cellPadding: 4,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.2
        },
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 100 }
        },
        margin: { left: 20, right: 20 }
      });

      // Signature handling
      const tableEndY = (pdf as any).lastAutoTable.finalY || 100;
      pdf.setFontSize(12);
      pdf.text('Signature:', 20, tableEndY + 10);

      if (formData.signature && formData.signature.startsWith('data:image/png;base64,')) {
        try {
          // Extract base64 data (remove prefix)
          const base64Data = formData.signature.replace('data:image/png;base64,', '');
          // Validate base64 string
          if (base64Data && /^[A-Za-z0-9+/=]+$/.test(base64Data)) {
            pdf.addImage(formData.signature, 'PNG', 20, tableEndY + 15, 60, 20);
          } else {
            pdf.text('Invalid signature data', 20, tableEndY + 15);
          }
        } catch (e) {
          console.error('Error adding signature image:', e);
          pdf.text('Failed to load signature', 20, tableEndY + 15);
        }
      } else {
        pdf.text('No valid signature provided', 20, tableEndY + 15);
      }

      // Footer
      pdf.setLineWidth(0.5);
      pdf.line(20, 270, 190, 270);
      pdf.setFontSize(10);
      pdf.text(
        'Generated by Invoice System | Contact: support@company.com | www.company.com',
        105,
        275,
        { align: 'center' }
      );

      const pdfBlob = pdf.output('blob');
      await this.invoiceService.submitInvoice(formData).toPromise();

      this.snackBar.open('Invoice submitted successfully!', 'Close', {
        duration: 5000,
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