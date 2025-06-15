import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { MatTableModule } from '@angular/material/table';
   import { MatButtonModule } from '@angular/material/button';
   import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
   import { InvoiceService } from '../../services/invoice.service';
   import jsPDF from 'jspdf';
   import { Invoice } from '../../interface/invoice.interface';
   @Component({
     selector: 'app-invoice-list',
     standalone: true,
     imports: [
       CommonModule,
       MatTableModule,
       MatButtonModule,
       MatSnackBarModule
     ],
     templateUrl: './invoice-list.component.html',
     styleUrls: ['./invoice-list.component.scss'],
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class InvoiceListComponent implements OnInit {
     invoices: Invoice[] = [];
     displayedColumns: string[] = ['id', 'fullName', 'invoiceNumber', 'amount', 'invoiceDate', 'actions'];

     constructor(
       private invoiceService: InvoiceService,
       private snackBar: MatSnackBar,
       private cdr: ChangeDetectorRef,
     ) {}

     ngOnInit(): void {
       this.loadInvoices();
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
       const pdf = new jsPDF();
       pdf.setFontSize(16);
       pdf.text('Invoice Details', 10, 10);
       pdf.setFontSize(12);
       pdf.text(`Full Name: ${invoice.fullName}`, 10, 20);
       pdf.text(`Email: ${invoice.email}`, 10, 30);
       pdf.text(`Phone: ${invoice.phone || 'N/A'}`, 10, 40);
       pdf.text(`Invoice Number: ${invoice.invoiceNumber}`, 10, 50);
       pdf.text(`Amount: ${invoice.amount}`, 10, 60);
       pdf.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 10, 70);

       if (invoice.signature) {
         pdf.text('Signature:', 10, 80);
         pdf.addImage(invoice.signature, 'PNG', 10, 85, 100, 40);
       }

       const pdfBlob = pdf.output('blob');
       const url = URL.createObjectURL(pdfBlob);
       const newWindow = window.open(url, '_blank');
       if (!newWindow) {
         this.snackBar.open('Popup blocked. Please allow popups.', 'Close', { duration: 5000 });
       }
     }
   }