import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './../dialog/dialog.component';
import { ApiService } from '../../shared/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { FolderService } from 'src/app/shared/services/folder.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { LeaveRequest } from '../leave-request/leave-request';
import { DialogDemandeCongeComponent } from '../dialog-demande-conge/dialog-demande-conge.component';

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
  uniqueTest: any;
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
  destroy$ = new Subject();
  deleteSub?: Subscription;
  findAllSub?: Subscription;

  users!: Observable<any[]>;
  collectionName = 'table-demande-conge';
  result: any;
  leaveRequestByUid$!: Observable<any[]>;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private leaveRequestService: LeaveRequestService,
    private afs: AngularFireStorage,
    private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private folderService: FolderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAllLeaveRequestsByUid();
    //this.users$ = this.userService.getUsers();

    this.getAllUsers;
    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        this.sub = this.userService
          .readUserWithUid(user.uid)
          .subscribe((data) => {
            this.uniqueUser = data;
          });

        this.subRequest = this.leaveRequestService
          .readPersonalByUid(user.uid)
          .subscribe((data) => {
            this.leavesRequest = data;
            console.log('this.leavesRequest :', this.leavesRequest);
          });
      }
    });

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;
      if (this.user) {
        this.leaveRequestByUid$ = this.leaveRequestService.readPersonalByUid(
          user.uid
        );
        console.log('leaveRequestByUid$: ', this.leaveRequestByUid$);
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService
          .readUserWithUid(user.uid)
          .subscribe((data) => {
            console.log('Dossier: ngOnInit readUserWithUid / data', data);
            this.uniqueUser = data;
            console.log('user data : -> ', this.user);
            console.log('mes users$ OBSERVABLE : -> ', this.users$);
          });
      }
    });
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
          console.log('user.displayName', user.displayName);
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
}
