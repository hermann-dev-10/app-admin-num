import { FormGroup, FormControl, FormArray } from '@angular/forms';

export type InvoiceFormType = FormGroup<{
  customer_name: FormControl;
  type: FormControl;
  description: FormControl;
  status: FormControl;
  created_at: FormControl;
  commentaire: FormControl;
  details: FormArray<
    FormGroup<{
      quantity: FormControl;
      amount: FormControl;
      description: FormControl;
    }>
  >;
}>;
