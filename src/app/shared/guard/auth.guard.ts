import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public afa: AngularFireAuth,
    public router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: any) => {
       if (user) {
          console.log('user : ',user);
          if(firebase.auth().currentUser && user.emailVerified){
            console.log('firebase.auth().currentUser', firebase.auth().currentUser);
            console.log('User Email Verified ?', user.emailVerified)
            resolve(true);
          }
          else{
            //window.alert('The user has not verified his account by email.')
            console.log('The user has not verified his account by email.');
            this.router.navigate(['/sign-in']);
            reject(false);
          }
         
        } else {
          console.log('User is not logged in');
          this.router.navigate(['/sign-in']);
          reject(false);
        }
      });
    });
  }
}
