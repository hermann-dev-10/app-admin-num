import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  etats = ["Pas commencé", "En cours", "Terminé"];
  folderForm!: FormGroup;
  sheetForm!: FormGroup;
  actionBtn: string ="Enregistrer";
  titleModal: string ="Ajouter un classeur";
  durationInSeconds = 5;
  lettre = "";
  isLetterNomenclatureChecked = false;
  isMonthNomenclatureChecked = false;
  isAbcChecked = true;
  userUid!: string;
  sub!: Subscription;
  user:any;


  constructor(
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private apiService: ApiService
  ) { }

   ngOnInit(): void {

    this.afAuth.authState.subscribe((user) => {
      this.user = user;

      if (this.user){

      }
    })
    this.sheetForm = this.formBuilder.group({
      //nomClient: ['', Validators.required],
      nomClasseur: ['', Validators.required],
      directory: ['', Validators.required],
      date: ['', Validators.required],
      //specificite: ['', Validators.required],
      //nomemclature: [''],
      //etat: ['', Validators.required],
      //price: ['', Validators.required],
      comment: ['', Validators.required],
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
        this.titleModal = "Modifier un classeur"
        //this.sheetForm.controls['nomClient'].setValue(this.editdata.nomClient);
        this.sheetForm.controls['nomClasseur'].setValue(this.editdata.nomClasseur);
        this.sheetForm.controls['directory'].setValue(this.editdata.directory);
        this.sheetForm.controls['date'].setValue(this.editdata.date);
        //this.sheetForm.controls['specificite'].setValue(this.editdata.specificite);
        //this.sheetForm.controls['nomemclature'].setValue(this.editdata.nomemclature);
        //this.sheetForm.controls['etat'].setValue(this.editdata.etat);
        //this.sheetForm.controls['price'].setValue(this.editdata.price);
        this.sheetForm.controls['comment'].setValue(this.editdata.comment);
    }
  }
  
  addFolder(){
    console.log('uid: ', this.user.uid);
    if(!this.editdata){
      if(this.sheetForm.valid){
        const result = this.apiService.createFolder(
          this.sheetForm.value.nomClasseur,
          this.sheetForm.value.directory,
          this.sheetForm.value.date,
          this.sheetForm.value.comment,
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
            this._snackBar.open(`${this.sheetForm.value.nomClasseur} added succesfully`, '', {
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

this._snackBar.open(`${this.sheetForm.value.nomClasseur} updated succesfully`, '', {

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

  onChange(ob: MatCheckboxChange) {
    console.log("PQR checked: " + ob.checked);
  } 

  toggleLetterNomenclature() {
    this.isLetterNomenclatureChecked = (this.isLetterNomenclatureChecked)? false : true;
  } 

  toggleMonthNomenclature() {
    this.isMonthNomenclatureChecked = (this.isMonthNomenclatureChecked)? false : true;
  }
}
