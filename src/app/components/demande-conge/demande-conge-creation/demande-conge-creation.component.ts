import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-demande-conge-creation',
  templateUrl: './demande-conge-creation.component.html',
  styleUrls: ['./demande-conge-creation.component.scss'],
})
export class DemandeCongeCreationComponent implements OnInit {
  leaveRequestForm!: FormGroup;
  user: any;
  sub: any;
  displayNameObs: any;
  //displayName: any;
  displayNameFinal: any;
  managed_by: any;
  created_at: any;
  managed_date: any;
  minDate: Date;
  maxDate: Date;
  today = new Date();

  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public userService: UserService,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private leaveRequestService: LeaveRequestService
  ) {}

  ngOnInit(): void {
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear - 20, 0, 1);
      this.maxDate = new Date(currentYear + 1, 11, 31);
      console.log('today', this.today);
      console.log('minDate: ',this.minDate);
      console.log('maxDate: ', this.maxDate);

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      console.log('USER-UID', this.userService.readUserWithUid(user.uid));
      this.user = user;

      if (this.user) {
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          (data) => {
            this.displayNameObs = data;

            for (let i = 0; i < this.displayNameObs.length; i++) {
              this.displayNameFinal = this.displayNameObs[i].displayName;
              console.log('this.displayNameFinal', this.displayNameFinal);
            }
          },
          (err) => {
            console.error('readUserWithUID error', err);
          }
        );
      }
    });

    this.leaveRequestForm = this.fb.group({
      //displayName: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['PROGRESSING', Validators.required],
      responsable: ['', Validators.required],
    });
  }

  get displayName() {
    return this.leaveRequestForm.controls.displayName;
  }

  get type() {
    return this.leaveRequestForm.controls.type;
  }

  get description() {
    return this.leaveRequestForm.controls.description;
  }

  get start_date() {
    return this.leaveRequestForm.controls.start_date;
  }

  get end_date() {
    return this.leaveRequestForm.controls.end_date;
  }

  get status() {
    return this.leaveRequestForm.controls.status;
  }

  get responsable() {
    return this.leaveRequestForm.controls.responsable;
  }

  onSubmit() {
    console.log(this.leaveRequestForm.value);
  }

  addLeaveRequest() {
    console.log('Step 1 AddLeaveRequest');
    console.log(this.leaveRequestForm.value);
    console.log('this.user.uid', this.user.uid);
    console.log('this.displayNameFinal: ', this.displayNameFinal);

    if (this.leaveRequestForm.valid) {
      console.log('Step 2 inside condition valid');

      console.log(
        ' this.leaveRequestForm.value.start_date',
        this.leaveRequestForm.value.start_date
      );
      const result = this.leaveRequestService.createLeaveRequest(
        this.displayNameFinal,
        this.leaveRequestForm.value.type,
        this.leaveRequestForm.value.description,
        this.leaveRequestForm.value.start_date,
        this.leaveRequestForm.value.end_date,
        this.leaveRequestForm.value.status,
        this.leaveRequestForm.value.responsable,
        (this.created_at = new Date()), //new Date(), //this.created_at
        (this.managed_by = null), //null by default
        (this.managed_date = null), //null by default
        this.user.uid
      );

      console.log('result: ', result);
      this._snackBar.open(
        `Demande de congé de ${this.displayNameFinal} ajouté avec avec succès.`,
        '',
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackbar-position-custom',
        }
      );
      this.leaveRequestForm.reset();
      this.router.navigateByUrl('/demandes-conge');
      //this.dialogRef.close('save');
    }
  }
}






  


  
