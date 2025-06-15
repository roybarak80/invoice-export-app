export interface Invoice {
  id?:string;
  fullName: string;
  email: string;
  phone?: string;
  invoiceNumber: string;
  amount: number;
  invoiceDate: string;
  signature: string;
  pdf?: string;
  createdAt?:string;
}
