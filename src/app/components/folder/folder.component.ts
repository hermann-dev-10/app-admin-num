import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './../dialog/dialog.component';
import { ApiService } from '../../shared/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { FolderService } from 'src/app/shared/services/folder.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
})
export class FolderComponent implements OnInit {
  displayedColumns: string[] = [
    'nomClasseur',
    'directory',
    'month-year',
    'state',
    'createdAt',
    'action',
  ];
  //  displayedColumns: string[] = ['nomClasseur', 'directory', 'folder', 'month-year', 'state', 'comment', 'createdAt', 'action'];
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

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private apiService: ApiService,
    private folderService: FolderService,
    private userService: UserService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.getAllFoldersByUid();
    console.log('this.getAllFolders()', this.getAllFoldersByUid());

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;
      if (this.user) {
        this.foldersByUid$ = this.apiService.readPersonalFolderByUid(user.uid);
        console.log('FoldersByUid: ', this.foldersByUid$);
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
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        this.getAllFoldersByUid();
      });
  }

  getAllFoldersByUid() {
    this.sub = this.afAuth.authState.subscribe((user) => {
      //this.api.getFolders()
      this.folderService.readPersonalFolderByUid(user.uid).subscribe({
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

  viewFolder(row: any) {
    this.router.navigate([`/folder-single/${row}`]);
    console.log('View sheet-single:', row);
  }

  editFolder(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllFoldersByUid();
        }
      });
  }

  deleteFolder(id: number) {
    this.apiService.deleteFolder(id);

    console.log('Folder deleted : ', id);

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
    this._snackBar.open('Classeur supprimé avec succès', '', {
      duration: 3000,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /*sortFoldersByDateDesc() {
    this.foldersByUid$.pipe(
      map((invoices) =>
        invoices.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      )
    );
  }*/

  /*sortInvoicesByDateAsc() {
    this.invoices$.pipe(
      map((invoices) =>
        invoices.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      )
    );*/
  /*ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    }*/
}
