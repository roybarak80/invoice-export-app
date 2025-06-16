import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Invoice } from '../interface/invoice.interface'

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = environment.apiBaseUrl;
  isDisplayInvoices$ = new BehaviorSubject<boolean>(false);
  private invoiceCreated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`).pipe(
      catchError(this.handleError)
    );
  }

  get invoiceCreated$(): Observable<void> {
    return this.invoiceCreated.asObservable();
  }

  submitInvoice(formData: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, {
      ...formData,
      invoiceDate: new Date(formData.invoiceDate).toISOString(),
      createdAt: new Date().toISOString()
    }).pipe(
      catchError(this.handleError),
      tap(() => this.invoiceCreated.next())
    );
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
