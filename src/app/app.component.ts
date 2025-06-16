import { Component} from '@angular/core';
import { InvoiceFormComponent } from "./components/invoice-form/invoice-form.component";
import { HttpClientModule } from '@angular/common/http';
import { InvoiceHeaderComponent } from "./components/invoice-header/invoice-header.component";
import { CommonModule } from '@angular/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component'
import { WelcomeComponent } from "./components/welcome/welcome.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InvoiceFormComponent, HttpClientModule, InvoiceHeaderComponent, CommonModule, InvoiceListComponent, WelcomeComponent],
  templateUrl: './app.component.html',
  styleUrl:'./app.component.scss',

})
export class AppComponent {

  constructor(public invoiceSrv: InvoiceService) {}
}
