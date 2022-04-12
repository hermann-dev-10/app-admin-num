import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';

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


  constructor(
    private formBuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private apiService: ApiService
  ) { }

   ngOnInit(): void {
    /*this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });*/

    this.sheetForm = this.formBuilder.group({
      nomClasseur: ['', Validators.required],
      nomClient: ['', Validators.required],
      etat: ['', Validators.required],
      //price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });

    if(this.editdata){
        this.actionBtn = "Modifier";
        this.titleModal = "Modifier un classeur"
        this.sheetForm.controls['nomClasseur'].setValue(this.editdata.nomClasseur);
        this.sheetForm.controls['nomClient'].setValue(this.editdata.nomClient);
        this.sheetForm.controls['etat'].setValue(this.editdata.etat);
        //this.sheetForm.controls['price'].setValue(this.editdata.price);
        this.sheetForm.controls['comment'].setValue(this.editdata.comment);
        this.sheetForm.controls['date'].setValue(this.editdata.date);
    }
  } addFolder(){
    if(!this.editdata){
      if(this.sheetForm.valid){
            this.api.postFolder(this.sheetForm.value)
            .subscribe({
              next:(res) => {
                this._snackBar.open('Element ajouté avec succès', '', {
                duration: 2000,
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
            })
      }
    }else{
          this.updateFolder();
        }
  }
  

  updateFolder(){
    this.api.putFolder(this.sheetForm.value, this.editdata.id)
    .subscribe({
      next:(res)=>{
         this._snackBar.open('Folder updated succesfully', '', {
         duration: 2000,
         verticalPosition: 'top',
                horizontalPosition: 'right',
            
         });
        this.sheetForm.reset();
        this.dialogRef.close('update');
      },
      error:()=> {
      alert('Error while updating the record')
    }
    }) 
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
