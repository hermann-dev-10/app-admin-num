import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../shared/services/auth.service';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  result: any;
  errorMessage: string = '';
  emailInput = '';
  passwordInput = '';
  loginForm!: FormGroup;
  submitted! : boolean;

  title = 'admin-num';
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
        public authService: AuthService,
        private fb: FormBuilder, 
        private router : Router
  ) { }

  ngOnInit() {
     this.loginForm = new FormGroup({
      email: new FormControl(this.emailInput,[
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]),
  
      password: new FormControl(this.passwordInput,[
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

   get email() { return this.loginForm.get('email'); }
   get password() { return this.loginForm.get('password'); }

  login(){

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.SignIn(email, password)
    .then(
      () => {
        this.router.navigate(['/dashboard']); //traiter également la partie connexion en tant que utilisateur normal
      }
    ).catch(
      (error) => {
        this.errorMessage = error;
        console.log(error);
      }
    )
  }

    onReset() {
  this.submitted = false;
  this.loginForm.reset();
   }
}
