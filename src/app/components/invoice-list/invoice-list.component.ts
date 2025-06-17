import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { MatTableModule } from '@angular/material/table';
   import { MatButtonModule } from '@angular/material/button';
   import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
   import { MatListModule } from '@angular/material/list';
   import { InvoiceService } from '../../services/invoice.service';
   import jsPDF from 'jspdf';
   import 'jspdf-autotable';
   import { Invoice } from '../../interface/invoice.interface';
   import {MatIconModule} from '@angular/material/icon';
   import {MatDividerModule} from '@angular/material/divider';
   import { Subscription } from 'rxjs';

   @Component({
     selector: 'app-invoice-list',
     standalone: true,
     imports: [
       CommonModule,
       MatTableModule,
       MatButtonModule,
       MatSnackBarModule,
       MatListModule,
       MatIconModule,
       MatDividerModule
     ],
     templateUrl: './invoice-list.component.html',
     styleUrls: ['./invoice-list.component.scss'],
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class InvoiceListComponent implements OnInit, OnDestroy {
     invoices: Invoice[] = [];
     displayedColumns: string[] = ['id', 'fullName', 'invoiceNumber', 'amount', 'invoiceDate', 'actions'];
     private subscription: Subscription = new Subscription();

     constructor(
       private invoiceService: InvoiceService,
       private snackBar: MatSnackBar,
       private cdr: ChangeDetectorRef,
     ) {}

     ngOnInit(): void {
       this.loadInvoices();
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


     regeneratePdf(invoice: Invoice): void {
      const { url } = this.invoiceService.generateInvoicePdf(invoice);
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        this.snackBar.open('Popup blocked. Please allow popups.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    }

     ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
   }
