import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../../shared/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { FolderService } from 'src/app/shared/services/folder.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  users$!: Observable<any[]>;
  displayedColumns: string[] = ['nomClient', 'nomClasseur', 'directory', 'month-year', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allFolders$!: Observable<any[]>;
  currentUser!: any;
  user = this.afAuth.currentUser;
  sub: any;
  uniqueUser: any;
  sideBarOpen = true;

  private foldersCollection: AngularFirestoreCollection<any>;
  folders$: Observable<any[]>
  folders: any[] = [];
  users: any[] = [];
  private companyCollection: AngularFirestoreCollection<any>;


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private folderService: FolderService,
    private afAuth: AngularFireAuth
  ) { }


  async ngOnInit() {


    //this.usersCollection = await this.userService.getUsers();

    this.userService.getUsers(); // on déclence la fonction getUsers
    console.log('this.userService.getUsers() : ', this.userService.getUsers());

    console.log('Users: ', this.users$);

    this.folders$ = this.folderService.getFolders();
    this.getAllFolders();
    console.log('this.folderService.readAllFolders(): ', this.folderService.readAllFolders());
    //console.log('this.readAll(): ', this.folderServic);


    //this.getAllUsers();
    //console.log('this.getAllUsers()', this.getAllUsers());
    this.foldersCollection = await this.folderService.readAllFolders();
    this.sub = this.foldersCollection.valueChanges({
      idField: 'id',

    }).subscribe(data => {
      this.folders = data;
    })


    this.companyCollection = this.userService.readAllCompany();
    this.sub = this.companyCollection.valueChanges({
      idField: 'id',

    }).subscribe(data => {
      this.users = data;
      console.log('this.company: ', this.users)
    })
  }




  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      //this.getAllFolders();
    });
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
    console.log('Users: this.userService.getUsers()');
  }

  getAllFolders() {

    this.sub = this.afAuth.authState.subscribe((user) => {

      //this.api.getFolders()
      this.folderService.getFolders()
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
        });
    });
  }

  viewFolder(row: any) {
    //viewProduct(){
    //this.router.navigateByUrl(`products/${this.productId}`);

    this.router.navigate([`/folders/${row}`]);
    console.log('View Folder:', row);
  }

  editFolder(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllFolders();
      }
    })
  }

  deleteFolder(id: number) {
    this.apiService.deleteFolder(id);
    console.log('Folder deleted : ', id)
    /*this.api.deleteFolder(id)
    .subscribe({
      next:(res)=>{
        this._snackBar.open('Dossier supprimé avec succès', '', {
                duration: 2000,
                
        });
      
        this.getAllFolders();
      },
      error:()=>{
        alert("Error while deleting the Folder!!");
      }
    })*/
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
