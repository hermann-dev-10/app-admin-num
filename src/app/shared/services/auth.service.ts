import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Router } from '@angular/router';
//import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { rejects } from 'assert';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  result: any;
  isAuth = false;
  userData: any; // Save logged in user data
  errorMessage: string = '';
  angularFireAuth: any;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) { 
        /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        //JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', '');
        //JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  async checkAuth(){
    const userCurrent = await this.afAuth.currentUser;

    console.log('checkAuth - currentUser : ' + userCurrent)
    if (userCurrent) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
   return userCurrent;
   }

   getCurrentUser(): Observable<any> {
    return this.angularFireAuth.authState;
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result: { user: any; }) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        //this.SetUserData(result.user);
      }).catch((error: { message: any; }) => {
        reject();
        window.alert(error.message)
        console.log(error.message);
      })
    })

  }

  // Sign up with email/password
  SignUp(email: string, password: string) { //ASYNC ?
    console.log('In SignUp function')
    return this.afAuth.createUserWithEmailAndPassword(email, password) // AWAIT ?
      .then((result:any) => {
        console.log('before send verification');
        //Call the SendVerificaitonMail() function when new user sign 
        //up and returns promise 
        this.SendVerificationMail();
        console.log('ok send verification');
        //this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

   //reécriture avec async await
   // Sign up with email/password
  
   async SignUpWork(email: string, password: string) {

    try {
      // code that we will 'try' to run
      this.result = await this.afAuth.createUserWithEmailAndPassword(email, password) 
      console.log('this.result', this.result);

      console.log('before send verification');
      //Call the SendVerificaitonMail() function when new user sign 
      //up and returns promise 
      this.SendVerificationMail();
      console.log('ok send verification');
      //this.SetUserData(this.result.user);


     } catch(error) {
      // code to run if there are any problems
      console.log('ERROR', error);
      this.errorMessage = 'Une erreur est survenue, veuillez recommencer';
     }

    /*this.result = await this.afAuth.createUserWithEmailAndPassword(this.registerForm.value.email,this.registerForm.value.password);

    console.log('register / result ', this.result);
    console.log('result.user : ', this.result.user);
    this.userUID = this.result.user.uid;
    console.log('this.userUID :', this.userUID);

    if(this.result) {
      this.userUID = this.result.user.uid;
      console.log('this.userUID :', this.userUID);
        const userCreated = await this.userService.createUser({ //spread operator.. 
          ...this.result.user,
          uid: this.userUID,
          firstname: this.registerForm.value.firstname,
          lastname: this.registerForm.value.lastname,
          email: this.registerForm.value.email,
          tel: this.registerForm.value.tel,           
        });
        console.log('userCreated', userCreated);
        this.result = null;
        this.registerForm.reset();

    }
    else{
      this.errorMessage = "Une erreur s'est produite, veuillez recommencez";
    }*/
  }

   // Send email verfificaiton when new user sign up
   SendVerificationMail() {
    console.log('in SendVerificationMail()');
    return this.afAuth.currentUser.then(u => u?.sendEmailVerification())
    .then(() => {
      console.log('this.afAuth.currentUser',this.afAuth.currentUser);
      this.router.navigate(['verify-email']);
    })
  }

   // Reset Forggot password
   ForgotPassword(passwordResetEmail:any) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error:any) => {
      window.alert(error)
    })
  }

  // Auth logic to run auth providers
  AuthLogin(provider:any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result:any) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      //this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  get isLoggedIn(): boolean {

  const user = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(user => {
    /*if(user?.emailVerified){
      console.log('email is verified');
    }else{
      console.log('email not verified');
      //window.alert('Please validate your account in the email you receive');
    }*/
  })   
  //const user = JSON.parse(localStorage.getItem('user'));
  //const user = localStorage.getItem('user');
  return (user !== null && user.emailVerified !== false) ? true : false;
   //return (user !== null) ? true : false;
}

 // Sign out 
 SignOut() {
  return this.afAuth.signOut().then(() => {
    localStorage.removeItem('user'); //to test if it's useful
    location.reload();  //test if it's the best way to do it ? Check with the obsersables
    this.router.navigate(['login']);
   
    //I found that when I log out the side bar is present despite my condition to display it only when the user is connected. 
    //At the beginning it works well but when I disconnect it remains displayed. But if I refresh the page, the sidebar disappears.
    //https://stackoverflow.com/questions/47813927/how-to-refresh-a-component-in-angular
    //location.reload(); //I added this piece of code to reload the page to make the side bar disappear
  })
}

}
