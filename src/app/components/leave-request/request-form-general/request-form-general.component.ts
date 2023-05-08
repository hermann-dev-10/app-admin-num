import { Component, Input, OnInit } from '@angular/core';
import { LeaveFormType } from '../request-form/leave-form-type';
import { FormBuilder } from '@angular/forms';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-request-form-general',
  templateUrl: './request-form-general.component.html',
  styleUrls: ['./request-form-general.component.scss'],
})
export class RequestFormGeneralComponent implements OnInit {
  @Input()
  parent?: LeaveFormType;
  user: any;
  sub: any;
  displayNameObs: any;
  displayName: any;

  constructor(
    private fb: FormBuilder,
    private service: LeaveRequestService,
    private router: Router,
    public userService: UserService,
    private afAuth: AngularFireAuth
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
  get type() {
    return this.parent?.controls.type;
  }

  get description() {
    return this.parent?.controls.description;
  }

  get responsable() {
    return this.parent?.controls.responsable;
  }
}
