import { FormGroup, FormControl, FormArray } from '@angular/forms';

export type ClasseurFormType = FormGroup<{
  binder_name:FormControl;
  customer_name: FormControl;
  description: FormControl;
  status: FormControl;
  created_at: FormControl;
  details: FormArray<
    FormGroup<{
      file_name: FormControl;
      folder_name: FormControl;
    }>
  >;
}>;
