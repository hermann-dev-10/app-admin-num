import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss'],
})
export class ModalUserComponent implements OnInit {
  result: any;

  userForm!: FormGroup;
  actionBtn: string = 'Enregistrer';
  titleModal: string = 'Ajouter un utilisateur';
  durationInSeconds = 5;
  userUID: any;

  submitted!: boolean;
  errorMessage: string = '';

  sub;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private dialogRef: MatDialogRef<ModalUserComponent>,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      userEmail: ['', Validators.required],
      password: ['', Validators.required],
      //password2: ['', Validators.required],
      //company: ['', Validators.required],
      typeAccount: ['', Validators.required],
    });

    if (this.editdata) {
      this.actionBtn = 'Modifier';
      this.titleModal = 'Modifier un utilisateur';
      this.userForm.controls['displayName'].setValue(
        this.editdata.nomUtilisateur
      );
      //this.userForm.controls['date'].setValue(this.editdata.email);
      //this.userForm.controls['comment'].setValue(this.editdata.comment);
    }
  }

  get displayName() {
    return this.userForm.get('displayName');
  }
  get userEmail() {
    return this.userForm.get('userEmail');
  }
  get password() {
    return this.userForm.get('password');
  }
  //get confirmPassword() { return this.userForm.get('confirmPassword'); }
  // get company() {
  //   return this.userForm.get('company');
  // }
  get typeAccount() {
    return this.userForm.get('typeAccount');
  }

  async addUser() {
    this.submitted = true;

    if (!this.userForm.valid) {
      return;
    }

    if (!this.editdata) {
      if (this.userForm.valid) {
        console.log('userForm.valid ? ?');
        console.log('userForm.value: ', this.userForm.value);
        try {
          // code that we will 'try' to run

          this.result = await this.afAuth.createUserWithEmailAndPassword(
            this.userForm.value.userEmail,
            this.userForm.value.password
          ); //this line is okay but defined equals something
          console.log('1. this.result :', this.result);

          if (this.result) {
            // jwtToken is a JWT token that wasn't generated through Firebase Admin
            //await signInWithCustomToken(auth, jwtToken);

            console.log('register / result ', this.result);
            console.log('result.user : ', this.result.user);

            this.userUID = this.result.user.uid;
            console.log('this.userUID :', this.userUID);
            const userCreated = await this.userService.createUser({
            //spread operator..
            //const userCreated = await this.userService.createUserBis({
              //...this.result.user,
              uid: this.userUID,
              email: this.userForm.value.userEmail,
              displayName: this.userForm.value.displayName,
              isAdmin: false,
              //isSuperAdmin: false,
              //company: 'NoCompany',
              //lastname: this.registerForm.value.lastname,
              //tel: this.registerForm.value.tel,
              createdAt: new Date(),
            });
            console.log('userCreated', userCreated); //Why this value is undefined ?
            //this.authService.SendVerificationMail();

            console.log('this.result', this.result);
            this.result = null;
            this.userForm.reset();
          }
        } catch (error) {
          // code to run if there are any problems
          console.log('ERROR', error);
          this.errorMessage = 'Une erreur est survenue, veuillez recommencer';
        }

        /*this.api.postUser(this.userForm.value)
            .subscribe({
              next:(res) => {
                this._snackBar.open('Element ajouté avec succès', '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackbar-position-custom'
                });
                this.userForm.reset();
                this.dialogRef.close('save');
              },
              error:()=>{
                alert("Error while adding the user");
              }
            })*/

        console.log('Result: ', this.result);
        this._snackBar.open(
          `${this.userForm.value.nomClasseur} ajouté avec succès.`,
          '',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-position-custom',
          }
        );
        this.userForm.reset();
        this.dialogRef.close('save');
      }
    } else {
      this.updateUser();
    }
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  updateUser() {
    //this.api.putUser(this.userForm.value, this.editdata.id)
    /*.subscribe({
      next:(res)=>{
         this._snackBar.open('Classeur mis à jour avec succès', '', {
         duration: 3000,
         verticalPosition: 'top',
                horizontalPosition: 'right',
            
         });
        this.sheetForm.reset();
        this.dialogRef.close('update');
      },
      error:()=> {
      alert('Error while updating the record')
    }
    })*/
    //          this.sheetForm.value.nomClasseur,

    this._snackBar.open(
      `${this.userForm.value.nomClasseur} mis à jour avec succès.`,
      '',
      {
        //this._snackBar.open('Classeur  mis à jour avec succès', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      }
    );
    this.userForm.reset();
    this.dialogRef.close('update');
  }

  openSnackBar() {
    this._snackBar.open('');
  }

  onChange(ob: MatCheckboxChange) {
    console.log('PQR checked: ' + ob.checked);
  }

  // This methods run when Angular destroy a component (cf component life cycle)
  // ngOnDestroy() {
  //   this.sub.unsubscribe(); // We unsubscribe from the observable
  // }
}
