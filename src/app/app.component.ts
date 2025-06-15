import { Component } from '@angular/core';
import { InvoiceFormComponent } from "./components/invoice-form/invoice-form.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InvoiceFormComponent, HttpClientModule],
  templateUrl: '../app/app.component.html',
  styleUrl:'./app.component.scss',

})
export class AppComponent {}
