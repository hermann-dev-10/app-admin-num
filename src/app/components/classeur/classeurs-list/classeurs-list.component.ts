import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject, Subscription } from 'rxjs';

import { takeUntil, map } from 'rxjs/operators';
import { Classeur } from '../classeur';
import { ClasseurService } from '../../../shared/services/classeur.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FolderService } from 'src/app/shared/services/folder.service';

@Component({
  selector: 'app-classeurs-list',
  templateUrl: './classeurs-list.component.html',
  styleUrls: ['./classeurs-list.component.scss'],
})
export class ClasseursListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'customer_name',
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
  classeurs$!: Observable<Classeur[]>;
  classeurs: Classeur[] = [];
  destroy$ = new Subject();
  deleteSub?: Subscription;
  findAllSub?: Subscription;

  users!: Observable<any[]>;
  collectionName = 'table-users';
  result: any;

  constructor(
    private classeurService: ClasseurService,
    private afs: AngularFireStorage,
    private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private folderService: FolderService
  ) {}

  ngOnInit(): void {
    //this.classeurs$ = this.classeurService.findAll();

    this.getAllClasseurs();
    console.log('Nombre: ', this.classeurs.length);

    //this.sortClasseursByDateDesc();
  }

  /*sortClasseursByDateDesc() {
    this.classeurs$.pipe(
      map((classeurs) =>
        classeurs.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      )
    );
  }*/

  /*sortClasseursByDateAsc() {
    this.classeurs$.pipe(
      map((classeurs) =>
        classeurs.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      )
    );
  }*/

  deleteClasseur(id: number) {
    const oldClasseurs = [...this.classeurs];

    this.classeurs = this.classeurs.filter((item) => item.id !== id);

    this.deleteSub = this.classeurService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getAllClasseurs(); //I call back the getAllClasseurs function so that the list is updated in the interface
        },
        error: () => {
          this.errorMessage =
            'Il y a eu un problème lors de la suppression du classeur';
          this.classeurs = oldClasseurs;
        },
      });

    console.log('Classeur n°', id, 'deleted.');
  }

  getAllClasseurs() {
    this.classeurService
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

    this.findAllSub = this.classeurService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (classeurs) => (this.classeurs = classeurs),
        error: () =>
          (this.errorMessage =
            'Il y a eu un problème lors de la récupération des classeurs'),
      });

      console.log('this.findAllSub:', this.findAllSub);
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
  //     this.classeurService.findAll().subscribe({
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
