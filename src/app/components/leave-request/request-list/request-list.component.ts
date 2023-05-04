import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject, Subscription } from 'rxjs';

import { takeUntil, map } from 'rxjs/operators';
import { LeaveRequest } from '../leave-request';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FolderService } from 'src/app/shared/services/folder.service';
@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'displayName',
    'type',
    'description',
    'status',
    'start_date',
    'end_date',
    'responsable',
    'created_at',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  foldersByUid$!: Observable<any[]>;
  currentUser!: any;
  user = this.afAuth.currentUser;
  sub: any;
  subTotalRequest: any;
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
  destroy$ = new Subject();
  deleteSub?: Subscription;
  findAllSub?: Subscription;

  users!: Observable<any[]>;
  collectionName = 'table-users';
  result: any;

  constructor(
    private leaveRequestService: LeaveRequestService,
    private afs: AngularFireStorage,
    private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private folderService: FolderService
  ) {}

  ngOnInit(): void {
    this.leaveRequests$ = this.leaveRequestService.findAll();

    this.getAllLeaveRequests();

    this.subTotalRequest = this.leaveRequestService
      .findAll()
      .subscribe((data) => {
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
  }

  deleteLeaveRequest(id: number) {
    const oldLeaveRequests = [...this.leaveRequests];

    this.leaveRequests = this.leaveRequests.filter((item) => item.id !== id);

    this.deleteSub = this.leaveRequestService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getAllLeaveRequests(); //I call back the getAllInvoices function so that the list is updated in the interface
        },
        error: () => {
          this.errorMessage =
            'Il y a eu un problème lors de la suppression de la demande de congé';
          this.leaveRequests = oldLeaveRequests;
        },
      });

    console.log('Demande de congé n°', id, 'deleted.');
  }

  getAllLeaveRequests() {
    this.leaveRequestService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

    this.findAllSub = this.leaveRequestService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leaveRequests) => (this.leaveRequests = leaveRequests),
        error: () =>
          (this.errorMessage =
            'Il y a eu un problème lors de la récupération des demandes de congé'),
      });
  }

  /*getUser(id: any) {
    return this.afs.doc(`${this.collectionName}/${id}`).valueChanges();
  }*/

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  // getAllFoldersByUid() {
  //   this.sub = this.afAuth.authState.subscribe((user) => {
  //     //this.api.getFolders()
  //     this.invoiceService.findAll().subscribe({
  //       next: (res) => {
  //         this.dataSource = new MatTableDataSource(res);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       },
  //       error: (err) => {
  //         //alert("Erreur pendant la collection des éléments!!");
  //         console.log('Error While fetching the records');
  //       },
  //     });
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.findAllSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }
}