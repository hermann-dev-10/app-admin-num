import { FormGroup, FormControl, FormArray } from '@angular/forms';

export type ClasseurFormType = FormGroup<{
  customer_name: FormControl;
  description: FormControl;
  status: FormControl;
  details: FormArray<
    FormGroup<{
      file_name: FormControl;
      folder_name: FormControl;
    }>
  >;
}>;
