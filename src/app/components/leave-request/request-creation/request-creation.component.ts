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
  displayName:any;
  uid:any;
  type:any;
  description:any;
  status:any;
  start_date:any;
  end_date:any;
  created_at:any;
  responsable:any;
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
              this.uid = this.displayNameObs[i].uid;
              console.log('this.displayName', this.displayName);
              console.log('this.uid', this.uid);
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
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private afAuth: AngularFireAuth,
    private leaveRequestService: LeaveRequestService,
  ) {}

  onSubmit(leaveRequestData: LeaveRequest) {
    console.log('Submit leave request? : ', leaveRequestData);
    const insertedInvoice = {
      ...leaveRequestData,

      /*this.type,
      this.description,
      this.status,
      this.start_date,
      this.end_date,
      this.created_at: new Date(),
      this.responsable,
      */
      //type: this.type,
      displayName: this.displayName,
      uid: this.uid
    };

    /*this.service.postLeaveRequest(insertedInvoice).subscribe({
      //this.service.postLeaveRequest(leaveRequestData).subscribe({
      next: () =>
        this.router.navigate(['../'], {
          relativeTo: this.route,
        }),
      error: (error: any) =>
        (this.errorMessage =
          'Une erreur est survenue, merci de réessayer plus tard'),
    });
    console.log('leaveRequestData : ', leaveRequestData);*/
    //const result = this.leaveRequestService.postLeaveRequest(insertedInvoice);
    
    // const result = this.leaveRequestService.postLeaveRequest(
    //   //insertedInvoice,
    //   this.displayName,
    //   this.type,
    //   this.description,
    //   this.status,
    //   this.start_date,
    //   this.end_date,
    //   this.created_at,
    //   this.responsable,
    //   this.uid,
    //   );

   //   console.log('result : ', result);

  }
 
}

