import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { UserService } from 'src/app/shared/services/user.service';
import { LeaveRequest } from '../../leave-request/leave-request';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-demande-conge',
  templateUrl: './edit-demande-conge.component.html',
  styleUrls: ['./edit-demande-conge.component.scss'],
})
export class EditDemandeCongeComponent implements OnInit {
  leaveRequestForm!: FormGroup;
  leaveRequest$?: Observable<LeaveRequest>;
  leaveRequestId?: number;

  user: any;
  sub: any;
  displayNameObs: any;
  //displayName: any;
  displayNameFinal: any;

  created_at;
  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private _snackBar: MatSnackBar,
    public userService: UserService,
    private afAuth: AngularFireAuth,
    private leaveRequestService: LeaveRequestService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

    this.leaveRequest$ = this.activatedRoute.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      tap((id) => (this.leaveRequestId = +id!)),
      switchMap((id) => this.leaveRequestService.find(+id!))
    );

    console.log('this.leaveRequest$:', this.leaveRequest$);
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

  updateLeaveRequestDecision() {
    this.leaveRequestService.update(
      this.leaveRequestForm.value,
      this.editdata.id
    );

    // this._snackBar.open(
    //   `Demande de congé de ${this.displayName} a été mis à jour avec avec succès.`,
    //   '',
    //   {
    //     duration: 3000,
    //     verticalPosition: 'top',
    //     horizontalPosition: 'right',
    //     panelClass: 'snackbar-position-custom',
    //   }
    // );
    //this.leaveRequestForm.reset();
  }
}
