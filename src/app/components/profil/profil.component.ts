import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from './../../shared/services/auth.service';
import { UserService } from './../../shared/services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  test: any[];
  arr = [
  { id: 1, language: 'typescript' },
  { id: 2, language: 'javascript' },
  { id: 3, language: 'typescript' },
];

    items = { keyOne: 'value 1', keyTwo: 'value 2', keyThree: 'value 3' };

  
  user:any;
  users$: Observable<any>[] = [] //user$: Observable<IUser>[] = [] 
  sub:any;
  uniqueUser:any;
  displayNameObs:any

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    public authService: AuthService,
    private afAuth: AngularFireAuth,
    public userService: UserService,

  ) { }

  ngOnInit(){

    this.sub = this.afAuth.authState.subscribe((user:any) => {
    console.log('USER-UID', this.userService.readUserWithUid(user.uid));
    this.user = user;


    if (this.user) {
         console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService.readUserWithUid(user.uid).subscribe( //Question : à propos de this.sub que j'ai écrit 2 fois
          (data) => {
            //this.uniqueUser = data;
            console.log('mes users$ OBSERVABLE : -> ', this.users$);
            this.displayNameObs = data;
            console.log('this.displayNameObs :', this.displayNameObs)

            //const company = this.displayNameObs.find(x=>x).company;
            //console.log('company - company: ', company);
            //console.log('getCompanyData():', this.getCompanyData);
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

get getCompanyData(){
  const company = this.displayNameObs.find(x=>x).company;
  return company;
}

}
