import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject, Subscription } from 'rxjs';

import { takeUntil, map } from 'rxjs/operators';
import { Invoice } from '../invoice';
import { InvoiceService } from '../../../shared/services/invoice.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FolderService } from 'src/app/shared/services/folder.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss'],
})
export class InvoicesListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'customer_name',
    'type',
    'description',
    'status',
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
  uniqueUser: any;
  users$: Observable<any>[] = [];
  sideBarOpen = true;

  message: string = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';

  errorMessage = '';
  invoices$!: Observable<Invoice[]>;
  invoices: Invoice[] = [];
  destroy$ = new Subject();
  deleteSub?: Subscription;
  findAllSub?: Subscription;

  users!: Observable<any[]>;
  collectionName = 'table-users';
  result: any;

  constructor(
    private invoiceService: InvoiceService,
    private afs: AngularFireStorage,
    private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private folderService: FolderService
  ) {}

  ngOnInit(): void {
    this.invoices$ = this.invoiceService.findAll();

    this.getAllInvoices();
  }

  deleteInvoice(id: number) {
    const oldInvoices = [...this.invoices];

    this.invoices = this.invoices.filter((item) => item.id !== id);

    this.deleteSub = this.invoiceService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getAllInvoices(); //I call back the getAllInvoices function so that the list is updated in the interface
        },
        error: () => {
          this.errorMessage =
            'Il y a eu un problème lors de la suppression de la facture';
          this.invoices = oldInvoices;
        },
      });
    console.log('Invoice n°', id, 'deleted.');
  }

  getAllInvoices() {
    this.invoiceService
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

    this.findAllSub = this.invoiceService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoices) => (this.invoices = invoices),
        error: () =>
          (this.errorMessage =
            'Il y a eu un problème lors de la récupération des factures'),
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