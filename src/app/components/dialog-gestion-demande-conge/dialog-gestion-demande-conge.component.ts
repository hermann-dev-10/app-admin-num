import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
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
import { DialogDemandeCongeComponent } from '../dialog-demande-conge/dialog-demande-conge.component';


@Component({
  selector: 'app-dialog-gestion-demande-conge',
  templateUrl: './dialog-gestion-demande-conge.component.html',
  styleUrls: ['./dialog-gestion-demande-conge.component.scss'],
})
export class DialogGestionDemandeCongeComponent implements OnInit {
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
  //users$!: Observable<any[]>;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayNameObs: any;
  displayName: any;
  type: any;
  description: any;
  responsable: any;
  status: any;
  start_date: any;
  end_date: any;
  created_at: any;
  managed_by: any;
  managed_date: any;

  demandesConge: any[];

  subscription: Subscription;
  //status = ['En attente', 'Acceptée', 'Annulée', 'Refusée'];
  selectedValue: number;
  selectedValueState: number;

  displayNameFinal: any;
  displayNameTest:any;

  constructor(
    private dialog: MatDialog,
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
    //this.users$ = this.userService.getUsers();
    //this.getAllUsers();
    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          (data) => {
            this.displayNameObs = data;

            for (let i = 0; i < this.displayNameObs.length; i++) {
              this.displayNameTest = this.displayNameObs[i].displayName;
              console.log('data', data);
              console.log('this.displayNameTest', this.displayNameTest);
            }
          },
          (err) => {
            console.error('readUserWithUID error', err);
          }
        );

        this.sub = this.leaveRequestService
          .readPersonalByUid(user.uid)
          .subscribe(
            (data) => {
              this.displayNameObs = data;

              for (let i = 0; i < this.displayNameObs.length; i++) {
                console.log('this.displayNameObs[i].displayName: ', this.displayNameObs[i].displayName);
                this.displayNameTest = this.displayNameObs[i].displayName;
                this.type = this.displayNameObs[i].type;
                this.description = this.displayNameObs[i].description;
                this.status = this.displayNameObs[i].status;
                this.responsable = this.displayNameObs[i].responsable;
                this.start_date = this.displayNameObs[i].start_date;
                this.end_date = this.displayNameObs[i].end_date;
                this.created_at = this.displayNameObs[i].created_at;
                this.managed_by = this.displayNameObs[i].managed_by;
                this.managed_date = this.displayNameObs[i].managed_date;
              }
            },
            (err) => {
              console.error('readLeaveRequestWithUID error', err);
            }
          );
      }
    });
   
    this.sub = this.afAuth.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        console.log('LeaveRequest USER ID', user.uid);
      }
    });
    if (this.editdata) {
      this.actionBtn = 'Modifier';
      this.titleModal = 'Modifier une demande de congé';
      this.addNextBtn = '';
    }
    console.log('just before FUNCTION INIT:', this.displayNameTest);

    this.initForm();
    this.fillFormToUpdate();
  }

  initForm() {
    console.log('INSIDE Before FUNCTION INIT:', this.displayNameTest);

    this.leaveRequestForm = this.fb.group({
      //displayName: [''], //name of the user connected
      type: '',
      description: '',
      start_date: '',
      end_date: '',
      status: ['PROGRESSING', [Validators.required]],
      //created_at: new Date(),
      managed_by: this.displayNameTest,
      managed_date: new Date(),
      responsable: '',
    });

    console.log('INSIDE AFTER FUNCTION INIT:', this.displayNameTest);
  }

  updateLeaveRequestDecision() {
    this.leaveRequestService.update(
      this.leaveRequestForm.value,
      this.editdata.id
    );

    this._snackBar.open(
      `Demande de congé de ${this.displayNameTest} a été mis à jour avec avec succès.`,
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

  openSnackBar() {
    this._snackBar.open('');
  }

  fillFormToUpdate() {
    this.leaveRequestForm.controls['type'].setValue(this.editdata.type);
    this.leaveRequestForm.controls['responsable'].setValue(
      this.editdata.responsable
    );
    this.leaveRequestForm.controls['description'].setValue(
      this.editdata.description
    );
    this.leaveRequestForm.controls['start_date'].setValue(
      this.editdata.start_date
    );
    this.leaveRequestForm.controls['end_date'].setValue(this.editdata.end_date);
    this.leaveRequestForm.controls['status'].setValue(this.editdata.status);
    
  }

  // getAllUsers() {
  //   this.userService.getUsers().subscribe({
  //     next: (res) => {
  //       this.dataSource = new MatTableDataSource(res);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     },
  //     error: (err) => {
  //       //alert("Erreur pendant la collection des éléments!!");
  //       console.log('Error While fetching the records');
  //     },
  //   });
  // }

  // editLeaveRequest(row: any) {
  //   this.dialog
  //     .open(DialogDemandeCongeComponent, {
  //       width: '30%',
  //       data: row,
  //     })
  //     .afterClosed()
  //     .subscribe((val) => {
  //       if (val === 'update') {
  //         this.getAllLeaveRequestsByUid();
  //       }
  //     });
  // }

  getAllLeaveRequestsByUid() {
    this.sub = this.afAuth.authState.subscribe((user) => {
      //this.api.getFolders()
      this.leaveRequestService.readPersonalByUid(user.uid).subscribe({
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
    });
  }
}
