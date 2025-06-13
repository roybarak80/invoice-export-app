import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoiceFormComponent } from "./components/invoice-form/invoice-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InvoiceFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'invoice-export-app';
}
