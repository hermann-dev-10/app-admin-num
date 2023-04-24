import { FormGroup, FormControl, FormArray } from '@angular/forms';

export type InvoiceFormType = FormGroup<{
  customer_name: FormControl;
  description: FormControl;
  status: FormControl;
  details: FormArray<
    FormGroup<{
      quantity: FormControl;
      amount: FormControl;
      description: FormControl;
    }>
  >;
}>;
