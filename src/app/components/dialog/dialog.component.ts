import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { Observable, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { 
  MomentDateAdapter, 
  MAT_MOMENT_DATE_ADAPTER_OPTIONS, 
} from '@angular/material-moment-adapter';
import { 
  DateAdapter, 
  MAT_DATE_FORMATS, 
  MAT_DATE_LOCALE 
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { UserService } from 'src/app/shared/services/user.service';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DialogComponent implements OnInit {

  date = new FormControl(moment());
  etats = ["Pas commencé", "En cours", "Terminé"];
  sheetForm!: FormGroup;
  actionBtn: string ="Enregistrer et quitter";
  addNextBtn: string="Enregistrer et suivant";
  titleModal: string ="Ajouter un classeur";
  durationInSeconds = 5;
  lettre = "";
  isLetterNomenclatureChecked = false;
  isLetterIndividualrNomenclatureChecked = false;
  isMonthNomenclatureChecked = false;
  isMonthNomenclatureIndividualChecked = false;
  isAbcChecked = true;
  userUid!: string;
  sub!: Subscription;
  user:any;
  users$: Observable<any>[] = [] //user$: Observable<IUser>[] = [] 
  displayNameObs:any
  selectedValue: number;
  selling_point: string;
  selling_points: any[]


  constructor(
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    public userService: UserService,
  ) { }

   ngOnInit(): void {

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
    //this.afAuth.authState.subscribe((user) => {
      //this.user = user;
      //if (this.user){
      //}
    //})
    this.sheetForm = this.formBuilder.group({
      //nomClient: ['', Validators.required],
      nomClasseur: ['', Validators.required],
      directory: ['', Validators.required],
      //date: ['', Validators.required],
      year: ['', Validators.required],
      month: ['', Validators.required],
      //specificite: ['', Validators.required],
      //nomemclature: [''],
      //etat: ['', Validators.required],
      //price: ['', Validators.required],
      comment: [''],
      folder: [''],
      //selling_folders: this.formBuilder.array([this.formBuilder.group({dossier:''})]),
    });

    this.sub = this.afAuth.authState
    .subscribe((user) =>{
      this.user = user;
      if(user){
        console.log('FOLDER USER ID', user.uid);
      }
    })

    if(this.editdata){
        this.actionBtn = "Modifier";
        this.titleModal = "Modifier un classeur";
        this.addNextBtn = '';
        //this.addNextBtn.
        //this.sheetForm.controls['nomClient'].setValue(this.editdata.nomClient);
        this.sheetForm.controls['nomClasseur'].setValue(this.editdata.nomClasseur);
        this.sheetForm.controls['directory'].setValue(this.editdata.directory);
        this.sheetForm.controls['year'].setValue(this.editdata.year);
        this.sheetForm.controls['month'].setValue(this.editdata.month);
        //this.sheetForm.controls['specificite'].setValue(this.editdata.specificite);
        //this.sheetForm.controls['nomemclature'].setValue(this.editdata.nomemclature);
        //this.sheetForm.controls['etat'].setValue(this.editdata.etat);
        //this.sheetForm.controls['price'].setValue(this.editdata.price);
        this.sheetForm.controls['comment'].setValue(this.editdata.comment);
        this.sheetForm.controls['folder'].setValue(this.editdata.folder);

    }
  }
  
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  addFolder(){
    if(!this.editdata){
      if(this.sheetForm.valid){
        const result = this.apiService.createFolder(
          this.getCompanyData, 
          this.sheetForm.value.nomClasseur,
          this.sheetForm.value.directory,
          this.sheetForm.value.year,
          this.sheetForm.value.month,
          this.sheetForm.value.comment,
          this.sheetForm.value.folder,
          new Date(),
          this.user.uid,
        )

            /*this.api.postFolder(this.sheetForm.value)
            .subscribe({
              next:(res) => {
                this._snackBar.open('Element ajouté avec succès', '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackbar-position-custom'
                });
                this.sheetForm.reset();
                this.dialogRef.close('save');
              },
              error:()=>{
                alert("Error while adding the folder");
              }
            })*/

            console.log('Result: ', result);
            this._snackBar.open(`${this.sheetForm.value.nomClasseur} ajouté avec avec succès.`, '', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'snackbar-position-custom'
              });
              this.sheetForm.reset();
              this.dialogRef.close('save');
      }
    }else{
          this.updateFolder();
        }
  }

  addFolderNext(){
    if(!this.editdata){
      if(this.sheetForm.valid){
        const result = this.apiService.createFolder(
          this.getCompanyData, 
          this.sheetForm.value.nomClasseur,
          this.sheetForm.value.directory,
          this.sheetForm.value.year,
          this.sheetForm.value.month,
          this.sheetForm.value.comment,
          this.sheetForm.value.folder,
          new Date(),
          this.user.uid,
        )
            this._snackBar.open(`${this.sheetForm.value.nomClasseur} ajouté avec avec succès. Vous pouvez désormais ajouter un autre classeur.`, '', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'snackbar-position-custom'
              });
              //this.dialogRef.close('save');
      }
    }else{
          this.updateFolder();
        }
  }
  

  updateFolder(){
    this.api.putFolder(this.sheetForm.value, this.editdata.id)
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

this._snackBar.open(`${this.sheetForm.value.nomClasseur} mis à jour avec succès.`, '', {

    //this._snackBar.open('Classeur  mis à jour avec succès', '', {
      duration: 3000,
      verticalPosition: 'top',
             horizontalPosition: 'right',
      });
     this.sheetForm.reset();
     this.dialogRef.close('update');
  }

   openSnackBar() {
    this._snackBar.open('');
  }

  onChange(event: MatRadioChange) {
    this.selectedValue = event.value;
    console.log('this.selectedValue', this.selectedValue);
  }

  /*onChange1(ob: MatCheckboxChange) {
    console.log("PQR checked: " + ob.checked);
  }*/

  toggleLetterNomenclature() {
    this.isLetterNomenclatureChecked = (this.isLetterNomenclatureChecked)? false : true;
  } 

  toggleLetterIndividualNomenclature() {
    this.isLetterIndividualrNomenclatureChecked = (this.isLetterIndividualrNomenclatureChecked)? false : true;
  } 

  toggleMonthNomenclature() {
    this.isMonthNomenclatureChecked = (this.isMonthNomenclatureChecked)? false : true;
  }

  toggleMonthIndividualNomenclature() {
    this.isMonthNomenclatureIndividualChecked = (this.isMonthNomenclatureIndividualChecked)? false : true;
  }

  get getCompanyData(){
    const company = this.displayNameObs.find(x=>x).company;
  return company;
}

 get sellingFolders() { //accessor
    return this.sheetForm.get('selling_folders') as FormArray;
  }

   addSellingFolder() {
    this.sellingFolders.push(this.formBuilder.group({folder:''}));
  }

  deleteSellingFolder(index) {
    this.sellingFolders.removeAt(index);
  }

}
