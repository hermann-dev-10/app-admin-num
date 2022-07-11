import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  user:any;
  users$: Observable<any>[] = [] //user$: Observable<IUser>[] = [] 
  sub:any;
  uniqueUser:any;
  displayNameObs:any

  constructor(
    private router: Router, 
    public authService: AuthService,
    private afAuth: AngularFireAuth,
    public userService: UserService,
    ) {}

  ngOnInit(): void {
    this.sub = this.afAuth.authState.subscribe((user:any) => {
      console.log('USER-UID', this.userService.readUserWithUid(user.uid));
      this.user = user;
  
      if (this.user) {
           //console.log(this.userService.readUserWithUid(user.uid));
  
          this.sub = this.userService.readUserWithUid(user.uid).subscribe( //Question : à propos de this.sub que j'ai écrit 2 fois
            (data) => {
  
              //console.log('ngOnInt readUserWithUID / data', data);
              //this.uniqueUser = data;
  
              //console.log('ngOnInt readUserWithUID / data', data);
              //this.uniqueUser = data;
              //console.log('user data : -> ', this.user);
             
              //console.log('mes users$ OBSERVABLE : -> ', this.users$);
        
              this.displayNameObs = data;
              //console.log('this.displayNameObs :', this.displayNameObs)
              /*if (!data || data.length === 0) {
                console.log(`Creating a new personal user for ${user.displayName}`);
                this.userService.createUser(this.uniqueUser);
              }*/
            },
            (err) => {
              console.error('readUserWithUID error', err);
            }
          );
        }
      });
  }

}
