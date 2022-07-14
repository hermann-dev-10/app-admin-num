import { Component, OnInit, ViewChild } from '@angular/core';
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
export class DashboardComponent implements OnInit {

  users$!: Observable<any[]>;
  displayedColumns: string[] = ['nomClient','nomClasseur', 'directory', 'month-year', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allFolders$!: Observable<any[]>;
  currentUser! :any;
  user = this.afAuth.currentUser;
  sub:any;
  uniqueUser: any;
  sideBarOpen = true;

  private foldersCollection: AngularFirestoreCollection<any>;
  folders$: Observable<any[]>
  folders: any[] = [];

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
    //this.getAllFolders();
    console.log('this.getAllFolders(): ',this.getAllFolders());
    this.users$ = this.userService.getUsers();
    console.log('Users: ', this.users$);
    //this.getAllUsers();
    //console.log('this.getAllUsers()', this.getAllUsers());
    this.foldersCollection = await this.folderService.readAllFolders();
    this.sub = this.foldersCollection.valueChanges({
      idField: 'id',
      
    }).subscribe(data => {
      this.folders = data;
      console.log('this.folders :', this.folders);
    }) 

    console.log('this.foldersCollection', this.foldersCollection)
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      //this.getAllFolders();
    });
  }

   getAllFolders(){

    //this.sub = this.afAuth.authState.subscribe((user) => {

      //this.api.getFolders()
      this.folderService.getFolders()
      .subscribe({
        next:(res)=> {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:(err)=> {
          //alert("Erreur pendant la collection des éléments!!");
          console.log('Error While fetching the records');
        }
      });
    //});
  }

  viewFolder(row:any){
  //viewProduct(){
    //this.router.navigateByUrl(`products/${this.productId}`);

    this.router.navigate([`/folders/${row}`]);
    console.log('View Folder:', row);
  }

  editFolder(row:any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val =>{
      if(val==='update'){
        this.getAllFolders();
      }
    })
  }

  deleteFolder(id:number){
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

}
