import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'; // Add ChangeDetectionStrategy
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../interface/invoice.interface';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoice-header',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './invoice-header.component.html',
  styleUrls: ['./invoice-header.component.scss'], // Fix: styleUrl -> styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush // Optional: Add for performance
})
export class InvoiceHeaderComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  isDisplayInvoice: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    public invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar // Add this
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.invoiceService.isDisplayInvoices$.subscribe((val) => this.isDisplayInvoice = val)
    this.subscription.add(
      this.invoiceService.invoiceCreated$.subscribe(() => {
        this.loadInvoices();
      })
    );
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.cdr.markForCheck();
      },
      error: () => this.snackBar.open('Failed to load invoices.', 'Close', { duration: 5000 })
    });
  }

  displayInvoices() {
    this.invoiceService.isDisplayInvoices$.next(!this.isDisplayInvoice)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
