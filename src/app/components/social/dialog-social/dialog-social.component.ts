import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { Observable, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogComponent } from '../../dialog/dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dialog-social',
  templateUrl: './dialog-social.component.html',
  styleUrls: ['./dialog-social.component.scss']
})


export class DialogSocialComponent implements OnInit {
  fileName = '';

  etats = ["À numériser", "En cours de numérisation", "Contrôle 1", "Contrôle 2", "Terminé"];
  folderForm!: FormGroup;
  //folderForm!: FormArray;
  actionBtn: string = "Enregistrer et quitter";
  addNextBtn: string = "Enregistrer et suivant";
  titleModal: string = "Ajouter une mesure";
  durationInSeconds = 5;
  isLetterNomenclatureChecked = false;
  isLetterIndividualrNomenclatureChecked = false;
  isMonthNomenclatureChecked = false;
  isMonthNomenclatureIndividualChecked = false;
  isAbcChecked = true;
  userUid!: string;
  sub!: Subscription;
  user: any;
  //users$: Observable<any>[] = [] //user$: Observable<IUser>[] = [] 
  users$!: Observable<any[]>;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayNameObs: any
  selectedValue: number;
  selectedValueState: number;
  selling_point: string;
  selling_points: any[];
  folders: any[];


  subscription: Subscription;
  submittedValue: any;
  noVisibleFieldFolder: boolean = false;
  selectedFiles: any;
  srcResult: any;
  file3Control: any;

  constructor(
    private http: HttpClient,
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
    this.users$ = this.userService.getUsers();
    console.log('Users: ', this.users$);
    this.getAllUsers();
    console.log('this.userService.getUsers()', this.userService.getUsers());
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

    this.folderForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      typeModule: ['', Validators.required],
      //fileInput: ['', Validators.required],
      stateFolder: [''],
      de_cordonnees: ['', Validators.required],
      comment: [''],
      state: ['', Validators.required],

    });


    this.sub = this.afAuth.authState
      .subscribe((user) => {
        this.user = user;
        if (user) {
          console.log('FOLDER USER ID', user.uid);
        }
      })
    if (this.editdata) {
      /*
      this.actionBtn = "Modifier";
      this.titleModal = "Modifier une mesure";
      console.log('noVisibleFieldFolder', this.noVisibleFieldFolder);
      this.addNextBtn = '';
      //this.folders = this.editdata.folder;
      this.folderForm.controls['nomClient'].setValue(this.editdata.nomClient);
      this.folderForm.controls['nomClasseur'].setValue(this.editdata.nomClasseur);
      this.folderForm.controls['directory'].setValue(this.editdata.directory);
      this.folderForm.controls['specificite'].setValue(this.editdata.specificite);
      this.folderForm.controls['year'].setValue(this.editdata.year);
      this.folderForm.controls['month'].setValue(this.editdata.month);
      //this.folderForm.controls['folder'].setValue(this.editdata.folder);
      //this.folderForm.value.selling_folders,
      this.folderForm.controls['state'].setValue(this.editdata.state);
      this.folderForm.controls['comment'].setValue(this.editdata.comment);
      //this.folderForm.controls['listMonthLetter'].patchValue(this.editdata.folder.map(x => Object.keys(this.editdata.folder)));
      //this.folderForm.controls['listMonthLetter'].patchValue(this.editdata.folder); //Bonne piste
      //this.folderForm.setControl('listMonthLetter', this.fb.array(this.editdata.folder));
      console.log("Object.keys(this.editdata.folderCustom.key)");
      console.log(Object.keys(this.editdata.folderCustom));
      console.log('folderCustom (this.editdata.folderCustom.key) : ', this.editdata.folderCustom.key);*/
    }
  }

  addFolder() {
    if (!this.editdata) {
      if (this.folderForm.valid) {
        if (this.selectedValue === 0) { //Month
          console.log('IF -> PETIT CHECK this.folderForm.value.listMonthLetter : ', this.folderForm.value.listMonthLetter);
          const checkboxControl = (this.folderForm.controls.listMonthLetter as FormArray);
          console.log('checkboxControl: ', checkboxControl.value);
          const formValue = {
            ...this.folderForm.value,
            listMonthLetter: checkboxControl.value.filter(value => !!value)
          }
          console.log('formValue', formValue);
          console.log('formValue.id', formValue.id);
          console.log('Object.keys(formValue) :', Object.keys(formValue));

          this.submittedValue = formValue;
        }
        else { //Letter
          console.log('ELSE');
          const checkboxControl = (this.folderForm.controls.listMonthLetter as FormArray);
          console.log('checkboxControl: ', checkboxControl.value);
          const formValue = {
            ...this.folderForm.value,
            listMonthLetter: checkboxControl.value.filter(value => !!value)
          }
          this.submittedValue = formValue;
        }

        console.log('this.submittedValue.value: ', this.submittedValue.value);
        console.log('this.submittedValue.listMonthLetter.value: ', this.submittedValue.listMonthLetter.value);
        const valueFolderCheckbox = this.submittedValue;
        console.log('Object.keys(valueFolderCheckbox.listMonthLetter) :', Object.keys(valueFolderCheckbox.listMonthLetter));
        const result = this.apiService.createFolder(
          //this.getCompanyData,
          this.folderForm.value.nomClient,
          this.folderForm.value.nomClasseur,
          this.folderForm.value.directory,
          this.folderForm.value.specificite,
          this.folderForm.value.year,
          this.folderForm.value.month,
          valueFolderCheckbox.listMonthLetter, //value of the checkbox (Month & Letter)
          this.folderForm.value.selling_folders,
          this.folderForm.value.state,
          this.folderForm.value.comment,
          new Date(),
          this.user.uid,

        )

        console.log('valueFolderCheckbox', valueFolderCheckbox);
        console.log('result: ', result);
        this._snackBar.open(`${this.folderForm.value.nomClasseur} ajouté avec avec succès.`, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackbar-position-custom'
        });
        this.folderForm.reset();
        this.dialogRef.close('save');
      }
    } else {
      this.updateFolder();
    }
  }



  updateFolder() {
    this.api.putFolder(this.folderForm.value, this.editdata.id)
    /*.subscribe({
      next:(res)=>{
         this._snackBar.open('Classeur mis à jour avec succès', '', {
         duration: 3000,
         verticalPosition: 'top',
                horizontalPosition: 'right',
            
         });
        this.folderForm.reset();
        this.dialogRef.close('update');
      },
      error:()=> {
      alert('Error while updating the record')
    }
    })*/
    //          this.folderForm.value.nomClasseur,

    this._snackBar.open(`${this.folderForm.value.nomClasseur} mis à jour avec succès.`, '', {

      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
    this.folderForm.reset();
    this.dialogRef.close('update');
  }

  openSnackBar() {
    this._snackBar.open('');
  }

  onChange(event: MatRadioChange) {
    this.selectedValue = event.value;
    console.log('this.selectedValue', this.selectedValue);
  }

  onChangeState(event: MatRadioChange) {
    this.selectedValueState = event.value;
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



  get title() {
    return this.folderForm.controls["title"] as FormArray;
  }

  /*get getListMonthLetter() {
    return this.folderForm.controls["listMonthLetter"] as FormArray;
  }*/

  addFolder1() {
    const folderForm = this.fb.group({
      title: ['', Validators.required],
    });
    this.title.push(this.folderForm);
    console.log(this.folderForm.value);
    console.log('Title : ', this.title.value);
  }

  deleteTitle(titleIndex: number) {
    this.title.removeAt(titleIndex);
  }



  getAllUsers() {
    this.userService.getUsers()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          //alert("Erreur pendant la collection des éléments!!");
          console.log('Error While fetching the records');
        }
      })
  }

  filePath() {
    //this.sellingFolders.value
    let path = window.document.getElementById("monChemin");
    console.log('file : ', this.folderForm.value.directory);
    console.log('path : ', path);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    console.log('this.selectedFiles : ', this.selectedFiles);
  }

  onFileSelected1() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {

      this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      const upload$ = this.http.post("/api/thumbnail-upload", formData);

      upload$.subscribe();
    }
  }
}
