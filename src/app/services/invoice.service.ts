import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Invoice } from '../interface/invoice.interface';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = environment.apiBaseUrl;
  isDisplayInvoices$ = new BehaviorSubject<boolean>(false);
  private invoiceCreated = new Subject<void>();

  constructor(private http: HttpClient) {}

  get invoiceCreated$(): Observable<void> {
    return this.invoiceCreated.asObservable();
  }

  submitInvoice(formData: Invoice, pdfBlob?: Blob): Observable<Invoice> {
    return new Observable((observer) => {
      if (!pdfBlob) {
        this.submitFormData(formData, observer);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const pdfBase64 = reader.result as string;
        this.submitFormData({ ...formData, pdf: pdfBase64 }, observer);
      };
      reader.readAsDataURL(pdfBlob);
    });
  }

  private submitFormData(formData: Invoice, observer: any): void {
    this.http.post<Invoice>(`${this.apiUrl}/invoices`, {
      ...formData,
      invoiceDate: new Date(formData.invoiceDate).toISOString(),
      createdAt: new Date().toISOString()
    }).pipe(
      catchError(this.handleError),
      tap(() => this.invoiceCreated.next())
    ).subscribe({
      next: (response) => observer.next(response),
      error: (error) => observer.error(error),
      complete: () => observer.complete()
    });
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`).pipe(
      catchError(this.handleError)
    );
  }

  generateInvoicePdf(invoice: Invoice): { blob: Blob, url: string } {
    const pdf = new jsPDF();
    let fontLoaded;
    try {
      pdf.addFont('../../assets/fonts/MiriamLibre-Regular.ttf', 'MiriamLibre', 'normal');
      pdf.setFont('MiriamLibre');
      fontLoaded = true;
    } catch (error) {
      console.error('Error loading Hebrew font:', error);
      pdf.setFont('Helvetica');
    }

    autoTable(pdf, {

      body: [
        ['Full Name', invoice.fullName],
        ['Email', invoice.email],
        ['Phone', invoice.phone || 'N/A'],
        ['Invoice Number', invoice.invoiceNumber],
        ['Amount', `$${invoice.amount.toFixed(2)}`],
        ['Invoice Date', new Date(invoice.invoiceDate).toLocaleDateString('en-US')]
      ],

      didParseCell: (data: any) => {
        if (data.column.index === 1) {
          data.cell.styles.halign = 'right';
        }
      }
    })

    // Signature
    const tableEndY = (pdf as any).lastAutoTable.finalY || 100;
    pdf.setFontSize(12);
    pdf.text('Signature:', 80, tableEndY + 20, { align: 'center' });

    if (invoice.signature && invoice.signature.startsWith('data:image/png;base64,')) {
      try {
        pdf.addImage(invoice.signature, 'PNG', 130, tableEndY + 15, 60, 20);
      } catch (e) {
        console.error('Error adding signature:', e);
        pdf.text('Invalid signature', 130, tableEndY + 15, { align: 'right' });
      }
    } else {
      pdf.text('No signature', 130, tableEndY + 15, { align: 'right' });
    }

    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    return { blob, url };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.status === 400) {
      errorMessage = 'Invalid request data. Please check your input.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    }
    return throwError(() => new Error(errorMessage));
  }
}