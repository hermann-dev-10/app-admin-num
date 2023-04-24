export type InvoiceDetail = {
  quantity: number;
  amount: number;
  description: number;
};

export type InvoiceStatus = 'PAID' | 'SENT' | 'CANCELED';

export type InvoiceDetails = InvoiceDetail[];

export type Invoice = {
  id?: number;
  customer_name: string;
  description: string;
  created_at: Date;
  status: InvoiceStatus;
  details: InvoiceDetails;
  total: string;
};
