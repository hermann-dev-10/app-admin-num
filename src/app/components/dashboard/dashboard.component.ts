import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { FolderService } from 'src/app/shared/services/folder.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import { AdminDialogComponent } from '../admin-folder/admin-dialog/admin-dialog.component';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { CompaniesService } from 'src/app/shared/services/companies.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'nomClasseur',
    'directory',
    'month-year',
    'state',
    'createdAt',
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
  users: any[] = [];
  private foldersCollection: AngularFirestoreCollection<any>;
  private userCollection: AngularFirestoreCollection<any>;
  folders$: Observable<any[]>;
  folders: any[] = [];

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
    private companyService: CompaniesService,
    private apiService: ApiService,
    private folderService: FolderService,
    private userService: UserService,
    private afAuth: AngularFireAuth
  ) {}

  async ngOnInit() {
    console.log('this.companyService : ', this.companyService.readAllCompany());
    //this.usersCollection = await this.userService.getUsers();
    this.userService.getUsers(); // on déclence la fonction getUsers
    console.log('this.userService.getUsers() : ', this.userService.getUsers());
    console.log('Users: ', this.users$);
    this.folders$ = this.folderService.getFolders();
    this.getAllFolders();
    console.log(
      'this.folderService.readAllFolders(): ',
      this.folderService.readAllFolders()
    );
    //console.log('this.readAll(): ', this.folderServic);
    //this.getAllUsers();
    //console.log('this.getAllUsers()', this.getAllUsers());
    this.foldersCollection = await this.folderService.readAllFolders();
    this.sub = this.foldersCollection
      .valueChanges({
        idField: 'id',
      })
      .subscribe((data) => {
        this.folders = data;
         console.log('this.folders: ', this.folders);

      });


      
    this.userCollection = this.userService.readAllUser();

    this.sub = this.userCollection
      .valueChanges({
        idField: 'id',
      })
      .subscribe((data) => {
        this.users = data;
        console.log('this.users: ', this.users);
      });
  }

  openDialogAdmin() {
    this.dialog
      .open(AdminDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        //this.getAllFolders();
      });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users) => (this.users = users));
    console.log('Users: this.userService.getUsers()');
  }

  getAllFolders() {
    this.sub = this.afAuth.authState.subscribe((user) => {
      //this.api.getFolders()
      this.folderService.getFolders().subscribe({
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
    //viewProduct(){
    //this.router.navigateByUrl(`products/${this.productId}`);
    this.router.navigate([`/folders/${row}`]);
    console.log('View Folder:', row);
  }

  editFolder(row: any) {
    this.dialog
      .open(AdminDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllFolders();
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
