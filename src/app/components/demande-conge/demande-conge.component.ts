import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './../dialog/dialog.component';
import { ApiService } from '../../shared/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { FolderService } from 'src/app/shared/services/folder.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { LeaveRequest } from '../leave-request/leave-request';
import { DialogDemandeCongeComponent } from '../dialog-demande-conge/dialog-demande-conge.component';
import * as firebase from 'firebase/app';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DialogGestionDemandeCongeComponent } from '../dialog-gestion-demande-conge/dialog-gestion-demande-conge.component';
//import { AngularFirestore } from '@angular/fire/firestore';
//Now import this
//import 'firebase/firestore';

@Component({
  selector: 'app-demande-conge',
  templateUrl: './demande-conge.component.html',
  styleUrls: ['./demande-conge.component.scss'],
})
export class DemandeCongeComponent implements OnInit {
  displayedColumns: string[] = [
    'displayName',
    'type',
    'description',
    'start_date',
    'end_date',
    'status',
    'responsable',
    'created_at',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  leavesByUid$!: Observable<any[]>;
  currentUser!: any;
  user = this.afAuth.currentUser;
  sub: any;
  subRequest: any;
  leavesRequest: any;
  uniqueUser: any;
  users$: Observable<any>[] = [];
  sideBarOpen = true;

  message: string = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';

  errorMessage = '';
  leaveRequests$!: Observable<LeaveRequest[]>;

  leaveRequests: LeaveRequest[] = [];
  dataTotalProgressingRequest: any;
  compteurProgressingRequest: any = 0;
  compteurAcceptedRequest: any = 0;
  compteurRefusedRequest: any = 0;
  subTotalRequest: any;

  destroy$ = new Subject();
  deleteSub?: Subscription;
  findAllSub?: Subscription;

  users!: Observable<any[]>;
  collectionName = 'table-demande-conge';
  result: any;
  leaveRequestByUid$!: Observable<any[]>;
  leaveRequest$!: Observable<any[]>;
  leaveRequest: LeaveRequest;

  displayDataUser: any;
  isAdmin: any;

  private leaveRequestsCollection: AngularFirestoreCollection<LeaveRequest>;
  private leavePersonalRequestsCollection: AngularFirestoreCollection<LeaveRequest>;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private leaveRequestService: LeaveRequestService,
    private afs: AngularFireStorage,
    private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,

    private folderService: FolderService,
    private userService: UserService,
    private route: ActivatedRoute //public firestore: AngularFirestore
  ) {}

  async ngOnInit() {
    this.leaveRequestsCollection = await this.leaveRequestService.findAll();
    this.sub = this.leaveRequestsCollection
      .valueChanges({
        idField: 'id',
      })
      .subscribe((data) => {
        this.leaveRequests = data;
      });

    this.getAllLeaveRequestsByUid();

    this.getAllUsers;
    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        this.sub = this.userService
          .readUserWithUid(user.uid)
          .subscribe((data) => {
            this.uniqueUser = data;

            for (var i = 0; i < this.uniqueUser.length; i++) {
              this.isAdmin = this.uniqueUser[i].isAdmin;
            }
          });

        this.subRequest = this.leaveRequestService
          .readPersonalByUid(user.uid)
          .subscribe((data) => {
            this.leavesRequest = data;
          });
      }
    });

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;
      if (this.user) {
        this.leaveRequestByUid$ = this.leaveRequestService.readPersonalByUid(
          user.uid
        );

        this.sub = this.userService
          .readUserWithUid(user.uid)
          .subscribe((data) => {
            this.uniqueUser = data;
          });
      }
    });

    this.leaveRequestService.getLeaveRequests().subscribe((data: any) => {
      this.dataTotalProgressingRequest = data;
      for (let i = 0; i < this.dataTotalProgressingRequest.length; i++) {
        switch (this.dataTotalProgressingRequest[i].status) {
          case 'PROGRESSING':
            // statement progressing
            this.compteurProgressingRequest++;
            break;
          case 'ACCEPTED':
            // statement accepted
            this.compteurAcceptedRequest++;
            break;
          case 'REFUSED':
            // statement refused
            this.compteurRefusedRequest++;
            break;
          default:
            //
            break;
        }
      }
    });

    const id = +this.route.snapshot.paramMap.get('id')!;
    this.leaveRequestService
      .find(id)
      .subscribe((leaveRequest: any) => (this.leaveRequest = leaveRequest));
  }

  openDialog() {
    this.dialog
      .open(DialogDemandeCongeComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        this.getAllLeaveRequestsByUid();
      });
  }

  getAllLeaveRequestsByUid() {
    this.sub = this.afAuth.authState.subscribe((user) => {
      console.log('this.sub :', this.sub);
      //this.api.getFolders()

      this.leaveRequestService.readPersonalByUid(user.uid).subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log('res', res);
        },
        error: (err) => {
          //alert("Erreur pendant la collection des éléments!!");
          console.log('Error While fetching the records');
        },
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  delete(id: number) {
    this.leaveRequestService.delete(id);
    console.log('Demande deleted : ', id);

    this._snackBar.open(`Mesure  ${id} supprimé avec succès`, '', {
      duration: 3000,
    });
      

    /*this.api.deleteFolder(id)
    .subscribe({
      next:(res)=>{
        this._snackBar.open('Dossier supprimé avec succès', '', {
                duration: 2000,
                
        });
      
        this.getAllFoldersByUid();
      },
      error:()=>{
        alert("Error while deleting the Folder!!");
      }
    })*/

    //this._snackBar.open(`${id}} supprimé avec succès`, '', {
    //this._snackBar.open('Demande supprimé avec succès', '', {
    //duration: 3000,
    //});
  }

  view(row: any) {
    this.router.navigate([`/mesure/${row}`]);
    console.log('View demande-conge-single:', row);
  }

  editLeaveRequest(row: any) {
    this.dialog
      .open(DialogGestionDemandeCongeComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllLeaveRequestsByUid();
        }
      });
  }
}
