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
          if(firebase.auth().currentUser/* && user.emailVerified*/){
            console.log('firebase.auth().currentUser', firebase.auth().currentUser);
            //console.log('User Email Verified ?', user.emailVerified)
            resolve(true);
          }
          /*else{
            //window.alert('The user has not verified his account by email.')
            console.log('The user has not verified his account by email.');
            this.router.navigate(['/login']);
            reject(false);
          }*/
        } else {
          console.log('User is not logged in');
          this.router.navigate(['/login']);
          reject(false);
        }

        //Route guard in angular 13 | role based authentication implementation| angular 13 tutorial #19
        //https://www.youtube.com/watch?v=qehzscbZyVY

        //https://stackoverflow.com/questions/64614505/how-to-guard-route-by-user-role-angular
        /*
        checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
        if (this.authService.isLoggedIn()) {
          const userRole = this.authService.getRole();
          if (route.data.role && route.data.role.indexOf(userRole) === -1) {
            this.router.navigate(['/home']);
            return false;
          }
          return true;
        }
    
        this.router.navigate(['/home']);
        return false;
      }
        
        */
      });
    });
  }
}
