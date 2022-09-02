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
import { default as _rollupMoment, Moment } from 'moment';
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
  //sheetForm!: FormArray;
  actionBtn: string = "Enregistrer et quitter";
  addNextBtn: string = "Enregistrer et suivant";
  titleModal: string = "Ajouter un classeur";
  durationInSeconds = 5;
  lettre = "";
  isLetterNomenclatureChecked = false;
  isLetterIndividualrNomenclatureChecked = false;
  isMonthNomenclatureChecked = false;
  isMonthNomenclatureIndividualChecked = false;
  isAbcChecked = true;
  userUid!: string;
  sub!: Subscription;
  user: any;
  users$: Observable<any>[] = [] //user$: Observable<IUser>[] = [] 
  displayNameObs: any
  selectedValue: number;
  selling_point: string;
  selling_points: any[];
  //folders: any[];
  listMonth = [
    {
      id: 1,
      value: 'Janvier',
      type:'Month'
    },
    {
      id: 2,
      value: 'Février',
      type: 'Month'
    },
    {
      id: 3,
      value: 'Mars',
      type: 'Month'
    },
    {
      id: 4,
      value: 'Avril',
      type: 'Month'
    },
    {
      id: 5,
      value: 'Mai',
      type: 'Month'
    },
    {
      id: 6,
      value: 'Juin',
      type: 'Month'
    },
    {
      id: 7,
      value: 'Juillet',
      type: 'Month'
    },
    {
      id: 8,
      value: 'Août',
      type: 'Month'
    },
    {
      id: 9,
      value: 'Septembre',
      type: 'Month'
    },
    {
      id: 10,
      value: 'Octobre',
      type: 'Month'
    },
    {
      id: 11,
      value: 'Novembre',
      type: 'Month'
    },
    {
      id: 12,
      value: 'Décembre',
      type: 'Month'
    },
    {
      id: 13,
      value: 'A',
      type: 'Letter'
    },
    {
      id: 14,
      value: 'B',
      type: 'Letter'
    },
    {
      id: 15,
      value: 'C',
      type: 'Letter'
    },
    {
      id: 16,
      value: 'D',
      type: 'Letter'
    },
    {
      id: 17,
      value: 'E',
      type: 'Letter'
    },
    {
      id: 18,
      value: 'F',
      type: 'Letter'
    },
    {
      id: 19,
      value: 'G',
      type: 'Letter'
    },
    {
      id: 20,
      value: 'H',
      type: 'Letter'
    },
    {
      id: 21,
      value: 'I',
      type: 'Letter'
    },
    {
      id: 22,
      value: 'J',
      type: 'Letter'
    },
    {
      id: 23,
      value: 'K',
      type: 'Letter'
    },
    {
      id: 24,
      value: 'L',
      type: 'Letter'
    },
    {
      id: 25,
      value: 'M',
      type: 'Letter'
    },
    {
      id: 14,
      value: 'B',
      type: 'Letter'
    },
  ]

  listLetter = [
    {
      id: 1,
      value: 'A',
    },
    {
      id: 2,
      value: 'B',
    },
    {
      id: 3,
      value: 'C',
    },
    {
      id: 4,
      value: 'D',
    },
    {
      id: 5,
      value: 'E',
    },
    {
      id: 6,
      value: 'F',
    },
    {
      id: 7,
      value: 'G',
    },
    {
      id: 8,
      value: 'H',
    },
    {
      id: 9,
      value: 'I',
    },
    {
      id: 10,
      value: 'J',
    },
    {
      id: 11,
      value: 'K',
    },
    {
      id: 12,
      value: 'L',
    },
    {
      id: 13,
      value: 'M',
    },
    {
      id: 14,
      value: 'N',
    },
    {
      id: 15,
      value: 'O',
    },
    {
      id: 16,
      value: 'P',
    },
    {
      id: 17,
      value: 'Q',
    },
    {
      id: 18,
      value: 'R',
    },
    {
      id: 19,
      value: 'S',
    },
    {
      id: 20,
      value: 'T',
    },
    {
      id: 21,
      value: 'U',
    },
    {
      id: 22,
      value: 'V',
    },
    {
      id: 23,
      value: 'W',
    },
    {
      id: 24,
      value: 'X',
    },
    {
      id: 25,
      value: 'Y',
    },
    {
      id: 26,
      value: 'Z',
    },

  ]
  subscription: Subscription;
  submittedValue: any;


  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    public userService: UserService,
  ) { }

  ngOnInit(): void {


    this.sub = this.afAuth.authState.subscribe((user: any) => {
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
    this.sheetForm = this.fb.group({
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
      //folder: [''],
      //title: this.fb.array([]),
      //folder: this.fb.array(['']),
      folders: this.fb.array([]),
      //selling_folders: new FormArray([]),
      //selling_folders: this.fb.array([]),
      //selling_folders: this.formBuilder.array([this.formBuilder.group({dossier:''})]),
      //courses: new FormArray([]),
      listMonth: this.fb.array(this.listMonth.map(x => false)),
      // Form Array to set default values
      // checkboxes: this.fb.array(this.checkboxes.map(x => this.defaultValues.includes(x.value) ? x.value : null))
    });

    const checkboxControlMonth = (this.sheetForm.controls.listMonth as FormArray);
    this.subscription = checkboxControlMonth.valueChanges.subscribe(checkbox => {
      checkboxControlMonth.setValue(
        checkboxControlMonth.value.map((value, i) => value ? this.listMonth[i].value : false),
        { emitEvent: false }
      );
    });

    /*const checkboxControlLetter = (this.sheetForm.controls.listLetter as FormArray);
    this.subscription = checkboxControlLetter.valueChanges.subscribe(checkbox => {
      checkboxControlLetter.setValue(
        checkboxControlLetter.value.map((value, i) => value ? this.listLetter[i].value : false),
        { emitEvent: false }
      );
    });*/

    this.sub = this.afAuth.authState
      .subscribe((user) => {
        this.user = user;
        if (user) {
          console.log('FOLDER USER ID', user.uid);
        }
      })

    if (this.editdata) {
      this.actionBtn = "Modifier";
      this.titleModal = "Modifier un classeur";
      this.addNextBtn = '';
      //this.folders = this.editdata.folder;
      this.sheetForm.controls['nomClasseur'].setValue(this.editdata.nomClasseur);
      this.sheetForm.controls['directory'].setValue(this.editdata.directory);
      this.sheetForm.controls['year'].setValue(this.editdata.year);
      this.sheetForm.controls['month'].setValue(this.editdata.month);
      this.sheetForm.controls['listMonth'].setValue(this.editdata.folder);
      //this.sheetForm.controls['folder'].setValue(this.editdata.folder);
      //this.sheetForm.value.selling_folders,
      this.sheetForm.controls['comment'].setValue(this.editdata.comment);
      console.log('Folders (this.editdata.folder) : ', this.editdata.folder);
      console.log('this.editdata.title :', this.editdata.title);

    }
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  addFolder() {
    if (!this.editdata) {
      if (this.sheetForm.valid) {
        if (this.selectedValue===0) { //Month
          console.log('IF -> PETIT CHECK this.sheetForm.value.listMonth : ', this.sheetForm.value.listMonth);
          const checkboxControl = (this.sheetForm.controls.listMonth as FormArray);

          console.log('checkboxControl: ', checkboxControl.value);
          const formValue = {
            ...this.sheetForm.value,
            listMonth: checkboxControl.value.filter(value => !!value)
          }
          this.submittedValue = formValue;
        }
        else { //Letter

          const checkboxControl = (this.sheetForm.controls.listMonth as FormArray);

          console.log('checkboxControl: ', checkboxControl.value);
          const formValue = {
            ...this.sheetForm.value,
            listMonth: checkboxControl.value.filter(value => !!value)
          }
          this.submittedValue = formValue;
        }


        console.log('this.submittedValue.value: ', this.submittedValue.value);
        console.log('this.submittedValue.listMonth.value: ', this.submittedValue.listMonth.value);


        const valueFolderCheckbox = this.submittedValue;

        const result = this.apiService.createFolder(
          this.getCompanyData,
          this.sheetForm.value.nomClasseur,
          this.sheetForm.value.directory,
          this.sheetForm.value.year,
          this.sheetForm.value.month,
          valueFolderCheckbox.listMonth, //value of the checkbox (Month & Letter)
          this.sheetForm.value.comment,
          //this.sheetForm.value.selling_folders,
          new Date(),
          this.user.uid,
        )

        console.log('valueFolderCheckbox', valueFolderCheckbox);

        console.log('result: ', result);

        this._snackBar.open(`${this.sheetForm.value.nomClasseur} ajouté avec avec succès.`, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackbar-position-custom'
        });
        this.sheetForm.reset();
        this.dialogRef.close('save');
      }
    } else {
      this.updateFolder();
    }
  }

  addFolderNext() {
    if (!this.editdata) {
      if (this.sheetForm.valid) {
        if (this.selectedValue === 0) { //Month
          console.log('IF -> PETIT CHECK this.sheetForm.value.listMonth : ', this.sheetForm.value.listMonth);
          const checkboxControl = (this.sheetForm.controls.listMonth as FormArray);

          console.log('checkboxControl: ', checkboxControl.value);
          const formValue = {
            ...this.sheetForm.value,
            listMonth: checkboxControl.value.filter(value => !!value)
          }
          this.submittedValue = formValue;
          console.log('formValue.listMonth.id', formValue.listMonth.id);
        }
        else { //Letter
          console.log('ELSE -> PETIT CHECK this.sheetForm.value.listLetter : ', this.sheetForm.value.listMonth);

          const checkboxControl = (this.sheetForm.controls.listMonth as FormArray);

          console.log('checkboxControl: ', checkboxControl.value);
          const formValue = {
            ...this.sheetForm.value,
            listMonth: checkboxControl.value.filter(value => !!value)
          }
          this.submittedValue = formValue;
        }
        const valueFolderCheckbox = this.submittedValue;
        console.log('valueFolderCheckbox.listMonth', valueFolderCheckbox.listMonth);

        const result = this.apiService.createFolder(
          this.getCompanyData,
          this.sheetForm.value.nomClasseur,
          this.sheetForm.value.directory,
          this.sheetForm.value.year,
          this.sheetForm.value.month,
          valueFolderCheckbox.listMonth, //value of the checkbox (Month & Letter)
          this.sheetForm.value.comment,
          //this.sheetForm.value.selling_folders,
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
    } else {
      this.updateFolder();
    }
  }


  updateFolder() {
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
    this.isLetterNomenclatureChecked = (this.isLetterNomenclatureChecked) ? false : true;
  }

  toggleLetterIndividualNomenclature() {
    this.isLetterIndividualrNomenclatureChecked = (this.isLetterIndividualrNomenclatureChecked) ? false : true;
  }

  toggleMonthNomenclature() {
    this.isMonthNomenclatureChecked = (this.isMonthNomenclatureChecked) ? false : true;
  }

  toggleMonthIndividualNomenclature() {
    this.isMonthNomenclatureIndividualChecked = (this.isMonthNomenclatureIndividualChecked) ? false : true;
  }

  get getCompanyData() {
    const company = this.displayNameObs.find(x => x).company;
    return company;
  }

  get sellingFolders() { //accessor
    return this.sheetForm.get('selling_folders') as FormArray;
  }

  addSellingFolder() {
    const folderForm = this.fb.group({
      title: ['', Validators.required],
    });

    this.title.push(this.fb.group({ folder: '' }));
    console.log('Folders: (title.value) :', this.title.value);

  }

  deleteSellingFolder(index) {
    this.title.removeAt(index);
  }


  /*get folders(): FormArray {
    //return this.sheetForm.get('courses') as FormArray;
    return this.formBuilder.control["folders"] as FormArray;
  }*/

  get folders() {
    //return this.sheetForm.get('courses') as FormArray;
    return this.sheetForm.controls["folders"] as FormArray;
  }

  onSubmit() {
    //console.log(this.courses.value);
    console.log('Folders (this.sellingFolders.value):', this.sellingFolders.value)
  }

  get title() {
    return this.sheetForm.controls["title"] as FormArray;
  }

  addFolder1() {
    const folderForm = this.fb.group({
      title: ['', Validators.required],
    });
    this.title.push(this.sheetForm);
    console.log(this.sheetForm.value);
    console.log('Title : ', this.title.value);
  }

  deleteTitle(titleIndex: number) {
    this.title.removeAt(titleIndex);
  }

  /*get resultMonth() {
    return this.listMonth.filter(item => item.checked);
  }*/



  /*submitCheckbox() {

    console.log('MONTH this.sheetForm.value.listMonth .length?? ', this.sheetForm.value.listMonth.length);
    console.log('Letter this.sheetForm.value.listMonth .length ', this.sheetForm.value.listLetter.length);

    const checkboxControl = (this.sheetForm.controls.listMonth as FormArray);
    const formValue = {
      ...this.sheetForm.value,
      listMonth: checkboxControl.value.filter(value => !!value)
    }

    console.log('this.submittedValue ?? ', this.submittedValue);

    return this.submittedValue = formValue;

  }*/
}
