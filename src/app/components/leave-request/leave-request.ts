// export type InvoiceDetail = {
//   quantity: number;
//   amount: number;
//   description: number;
// };

 export type LeaveRequestStatus = 'ACCEPTED' | 'PROGRESSING' | 'CANCELED' | 'REFUSED';

 export type Responsable = 'DELACHENAL' | 'KOHLER' | 'SOUCHET' | 'VALITON' | 'MANUEL';

// export type InvoiceDetails = InvoiceDetail[];

export type LeaveRequest = {
  id?: number;
  displayName: string;
  type: string;
  description: string;
  status: LeaveRequestStatus;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  managed_by: string;
  managed_date: string;
  responsable: Responsable;
  //   details: InvoiceDetails;
};
