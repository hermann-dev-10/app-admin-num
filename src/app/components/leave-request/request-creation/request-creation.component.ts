import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';

import { LeaveRequest } from './../leave-request';
import { LeaveRequestService } from './../../../shared/services/leave-request.service';

@Component({
  selector: 'app-request-creation',
  templateUrl: './request-creation.component.html',
  styleUrls: ['./request-creation.component.scss'],
})
export class RequestCreationComponent implements OnInit {
  errorMessage = '';
  displayName: any;
  sub: any;
  user: any;

  displayNameObs: any;
  userConnected: any;

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
              this.displayName = this.displayNameObs[i].displayName;
              console.log('this.displayName', this.displayName);
            }
          },
          (err) => {
            console.error('readUserWithUID error', err);
          }
        );
      }
    });
  }

  constructor(
    private service: LeaveRequestService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private afAuth: AngularFireAuth
  ) {}

  onSubmit(leaveRequestData: LeaveRequest) {
    console.log('Submit leave request? : ', leaveRequestData);
    const insertedInvoice = {
      ...leaveRequestData,
      displayName: this.displayName,
    };
    this.service.postLeaveRequest(insertedInvoice).subscribe({
      //this.service.postLeaveRequest(leaveRequestData).subscribe({
      next: () =>
        this.router.navigate(['../'], {
          relativeTo: this.route,
        }),
      error: (error: any) =>
        (this.errorMessage =
          'Une erreur est survenue, merci de réessayer plus tard'),
    });
    console.log('leaveRequestData : ', leaveRequestData);
  }
}
