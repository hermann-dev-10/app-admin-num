import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalUserComponent } from '../modal-user/modal-user.component';
import { ApiService } from '../../shared/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['userName', 'userEmail', 'company', 'createdAt', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  folders$!: Observable<any[]>;

  constructor(
    private dialog: MatDialog, 
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
   /* console.log('Hallo');
        this.users$ = this.userService.getUsers();
        console.log('Users: ', this.folders$);
        this.getAllFolders();
        console.log('this.getAllUsers()', this.getAllUsers());*/
  }

  openDialog() {
    this.dialog.open(ModalUserComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      this.getAllUsers();
    })
  }

   getAllUsers(){
    /*this.userService.getUsers()
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
    })*/
  }

  /*viewFolder(row:any){
    this.router.navigate([`/folder-single/${row}`]);
    console.log('View sheet-single:', row);
  }*/

  editUser(row:any){
    this.dialog.open(ModalUserComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val =>{
      if(val==='update'){
        this.getAllUsers();
      }
    })
  }



  deleteUser(id:number){
    //this.userService.deleteUser(id);
    console.log('User deleted : ', id)
    /*this.api.deleteUser(id)
    .subscribe({
      next:(res)=>{
        this._snackBar.open('User deleted succesfully', '', {
                duration: 2000,
                
        });
      
        this.getAllUsers();
      },
      error:()=>{
        alert("Error while deleting the Folder!!");
      }
    })*/

    this._snackBar.open(`${id}} deleted succesfully`, '', {
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

}
