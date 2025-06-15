import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Invoice {
  fullName: string;
  email: string;
  phone?: string;
  invoiceNumber: string;
  amount: number;
  invoiceDate: string;
  signature: string;
  pdf?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  submitInvoice(formData: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, {
      ...formData,
      invoiceDate: new Date(formData.invoiceDate).toISOString(),
      createdAt: new Date().toISOString()
    }).pipe(
      catchError(this.handleError)
    );
  }

  submitPdf(pdfBlob: Blob, formData: Invoice): Observable<Invoice> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        const pdfBase64 = reader.result as string;
        this.http.post<Invoice>(`${this.apiUrl}/invoices/upload-pdf`, {
          ...formData,
          pdf: pdfBase64,
          invoiceDate: new Date(formData.invoiceDate).toISOString(),
          createdAt: new Date().toISOString()
        }).pipe(
          catchError(this.handleError)
        ).subscribe({
          next: (response) => observer.next(response),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      };
      reader.readAsDataURL(pdfBlob);
    });
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
