import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LeaveRequest } from '../leave-request';
import { LeaveFormType } from './leave-form-type';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent implements OnInit {
  sideBarOpen = true;
  user: any;
  sub: any;
  displayNameObs: any;
  userConnected: any;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  @Output('leave-request-submit') invoiceSubmitEvent =
    new EventEmitter<LeaveRequest>();

  @Input() leaveRequest?: LeaveRequest;
  @Input() displayName?: any;

  // detailsExistsValidator: ValidatorFn = (control: AbstractControl) => {
  //   const details = control.get('details') as FormArray;

  //   return details.length > 0
  //     ? null
  //     : {
  //         noDetails: true,
  //       };
  // };

  constructor(
    private fb: FormBuilder,
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    public userService: UserService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    if (!this.leaveRequest) {
      return;
    }

    //this.leaveRequest.details.forEach((item) => this.onAddDetail());

    //console.log('details ?: ', this.details.value);

    // console.log(
    //   'this.leaveRequestForm.controls.details.value ?: ',
    //   this.leaveRequestForm.controls.details.value
    // );

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      console.log('USER-UID', this.userService.readUserWithUid(user.uid));
      this.user = user;

      if (this.user) {
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          (data) => {
            this.displayNameObs = data;

            for (let i = 0; i < this.displayNameObs.length; i++) {
              this.displayName = this.displayNameObs[i].displayName;
            }
          },
          (err) => {
            console.error('readUserWithUID error', err);
          }
        );
      }
    });

    this.leaveRequestForm.patchValue(this.leaveRequest);

    //console.log('this.userConnectedFunction():', this.userConnectedFunction());
  }

  leaveRequestForm: LeaveFormType = this.fb.group({
    displayName: [this.displayName], //name of the user connected
    type: ['', [Validators.required]], //[('', [Validators.required, Validators.minLength(3)])],
    description: ['', [Validators.required, Validators.minLength(3)]],
    status: ['PROGRESSING', [Validators.required]],
    start_date: ['', [Validators.required]],
    end_date: ['', [Validators.required]],
    created_at: new Date(),
    responsable: ['', [Validators.required]],

    // details: this.fb.array<FormGroup>([]),
  });

  // userConnectedFunction(user: string){
  //   this.userConnected = this.displayNameObs[i].displayName;

  //   return this.userConnected;
  // }
  // get details() {
  //   return this.leaveRequestForm.controls.details;
  // }

  // onAddDetail() {
  //   this.details.push(
  //     this.fb.group({
  //       description: ['', [Validators.required, Validators.minLength(3)]],
  //       amount: ['', [Validators.required, Validators.minLength(0)]],
  //       quantity: ['', [Validators.required, Validators.minLength(0)]],
  //     })
  //   );
  // }

  // onRemoveDetail(index: number) {
  //   this.details.removeAt(index);
  // }

  onSubmit() {
    console.log('this.leaveRequestForm.value:', this.leaveRequestForm.value);
    if (this.leaveRequestForm.invalid) {
      return;
    }
    this.invoiceSubmitEvent.emit(this.leaveRequestForm.value as LeaveRequest);

    console.log('Ok ADD Leave Request:', this.leaveRequestForm.value);

    this.leaveRequestService.postLeaveRequest(
      this.leaveRequestForm.value.displayName,
      this.leaveRequestForm.value.type,
      this.leaveRequestForm.value.description,
      this.leaveRequestForm.value.status,
      this.leaveRequestForm.value.start_date,
      this.leaveRequestForm.value.end_date,
      this.leaveRequestForm.value.created_at,
      this.leaveRequestForm.value.responsable,
      'uid'
    );
    //this.leaveRequestService.postLeaveRequest(this.leaveRequestForm.value as LeaveRequest);
    this.router.navigateByUrl('/leave-requests');

      //.pipe(tap(() => this.router.navigateByUrl('/invoices')))
      //.subscribe();
  }
}
