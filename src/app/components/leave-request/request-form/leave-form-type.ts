import { FormGroup, FormControl, FormArray } from '@angular/forms';

export type LeaveFormType = FormGroup<{
  displayName;
  type: FormControl;
  description: FormControl;
  status: FormControl;
  start_date: FormControl;
  end_date: FormControl;
  created_at;
  managed_by;
  responsable: FormControl;
  //   details: FormArray<
  //     FormGroup<{
  //       quantity: FormControl;
  //       amount: FormControl;
  //       description: FormControl;
  //     }>
  //   >;
}>;

