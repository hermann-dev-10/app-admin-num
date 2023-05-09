import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
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
import { DialogComponent } from '../dialog/dialog.component';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';

@Component({
  selector: 'app-dialog-demande-conge',
  templateUrl: './dialog-demande-conge.component.html',
  styleUrls: ['./dialog-demande-conge.component.scss'],
})
export class DialogDemandeCongeComponent implements OnInit {
  leaveRequestForm!: FormGroup;
  //leaveRequestForm!: FormArray;
  actionBtn: string = 'Enregistrer et quitter';
  addNextBtn: string = 'Enregistrer et suivant';
  titleModal: string = 'Ajouter une demande de congé';
  durationInSeconds = 5;
  submittedValue: any;
  userUid!: string;
  sub!: Subscription;
  user: any;
  //users$: Observable<any>[] = [] //user$: Observable<IUser>[] = []
  users$!: Observable<any[]>;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayNameObs: any;
  displayName: any;

  demandesConge: any[];

  subscription: Subscription;
  created_at:any;
  status = ['En attente', 'Acceptée', 'Annulée', 'Refusée'];
  selectedValue: number;
  selectedValueState: number;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private leaveRequestService: LeaveRequestService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
    this.getAllUsers();
    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          (data) => {
            this.displayNameObs = data;

            for (let i = 0; i < this.displayNameObs.length; i++) {
              this.displayName = this.displayNameObs[i].displayName;
            }
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

    this.leaveRequestForm = this.fb.group({
      displayName: [''], //name of the user connected
      type: ['', [Validators.required]], //[('', [Validators.required, Validators.minLength(3)])],
      description: ['', [Validators.required, Validators.minLength(2)]],
      status: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      created_at: new Date(),
      responsable: ['', [Validators.required]],
    });

    this.sub = this.afAuth.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        console.log('LeaveRequest USER ID', user.uid);
      }
    });
    if (this.editdata) {
      this.actionBtn = 'Modifier';
      this.titleModal = 'Modifier un classeur';
      this.addNextBtn = '';

      this.leaveRequestForm.patchValue({
        nomClasseur: 'TEST-NOM-CLASSEUR',
        directory: 'TEST-NOM-DIRECTORY',
      });

      this.leaveRequestForm.patchValue([{ LeaveRequest: 'TEST' }]);
    }
  }

  addLeaveRequest() {
    if (!this.editdata) {
      console.log('Etape 1 Form');
      if (this.leaveRequestForm.valid) {

        console.log('Etape 2 in condition');
        /*const result = this.leaveRequestService.createLeaveRequest(
          this.leaveRequestForm.value.displayName,
          this.leaveRequestForm.value.type,
          this.leaveRequestForm.value.responsable,
          this.leaveRequestForm.value.description,
          //this.leaveRequestForm.value.start_date,
          //this.leaveRequestForm.value.end_date,
          this.leaveRequestForm.value.status,
          this.created_at,
          this.user.uid
        );

        console.log('result:', result);*/
        // const result = this.leaveRequestService.postLeaveRequest(
        //   //insertedInvoice,
        //   this.displayName,
        //   this.type,
        //   this.description,
        //   this.status,
        //   this.start_date,
        //   this.end_date,
        //   this.created_at,
        //   this.responsable,
        //   this.uid,
        //   );



        this._snackBar.open(
          /*          `${this.leaveRequestForm.value.nomClasseur} ajouté avec avec succès.`,*/
          `Ajouté avec avec succès.`,
          '',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-position-custom',
          }
        );
        this.leaveRequestForm.reset();
        this.dialogRef.close('save');
      }
    } //else {
    //   this.updateLeaveRequest();
    // }
  }

  addLeaveRequestNext() {
    // if (!this.editdata) {
    //   if (this.leaveRequestForm.valid) {
    //     const result = this.leaveRequestService.createLeaveRequest(
    //       //this.getCompanyData,
    //       this.leaveRequestForm.value.nomClient,
    //       this.leaveRequestForm.value.nomClasseur,
    //       this.leaveRequestForm.value.directory,
    //       this.leaveRequestForm.value.specificite,
    //       this.leaveRequestForm.value.year,
    //       this.leaveRequestForm.value.month,
    //       this.leaveRequestForm.value.selling_folders,
    //       this.leaveRequestForm.value.state,
    //       this.leaveRequestForm.value.comment,
    //       new Date(),
    //       this.user.uid
    //     );
    //     this._snackBar.open(
    //       `${this.leaveRequestForm.value.nomClasseur} ajouté avec avec succès. Vous pouvez désormais ajouter un autre classeur.`,
    //       '',
    //       {
    //         duration: 5000,
    //         verticalPosition: 'top',
    //         horizontalPosition: 'right',
    //         panelClass: 'snackbar-position-custom',
    //       }
    //     );
    //     //this.dialogRef.close('save');
    //   }
    // } else {
    //   this.updateLeaveRequest();
    // }
  }

  // updateLeaveRequest() {
  //   this.api.putFolder(this.leaveRequestForm.value, this.editdata.id);
  //   this._snackBar.open(
  //     `${this.leaveRequestForm.value.nomClasseur} mis à jour avec succès.`,
  //     '',
  //     {
  //       duration: 3000,
  //       verticalPosition: 'top',
  //       horizontalPosition: 'right',
  //     }
  //   );
  //   this.leaveRequestForm.reset();
  //   this.dialogRef.close('update');
  // }

  openSnackBar() {
    this._snackBar.open('');
  }

  get getCompanyData() {
    const company = this.displayNameObs.find((x) => x).company;
    return company;
  }

  onSubmit() {
    console.log('ok envoi!');
  }

  getAllUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        //alert("Erreur pendant la collection des éléments!!");
        console.log('Error While fetching the records');
      },
    });
  }

  onChangeState(event: MatRadioChange) {
    this.selectedValueState = event.value;
    console.log('this.selectedValue', this.selectedValue);
  }
}
