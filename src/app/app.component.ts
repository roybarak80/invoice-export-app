import { Component } from '@angular/core';
import { InvoiceFormComponent } from "./components/invoice-form/invoice-form.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InvoiceFormComponent, HttpClientModule],
  template: `<app-invoice-form></app-invoice-form>`
})
export class AppComponent {}