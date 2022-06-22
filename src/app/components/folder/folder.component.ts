import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './../dialog/dialog.component';
import { ApiService } from './../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  displayedColumns: string[] = ['nomClasseur', 'directory', 'date', 'comment', 'action'];
  //displayedColumns: string[] = ['nomClasseur', 'nomClient', 'date', 'etat', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  folders$!: Observable<any[]>;


  constructor(
    private dialog: MatDialog, 
    private api: ApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    console.log('Hallo');
        this.folders$ = this.apiService.getFolders();
        console.log('Folders: ', this.folders$);
        this.getAllFolders();
        console.log('this.getAllFolders()', this.getAllFolders());
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      this.getAllFolders();
    });
  }

   getAllFolders(){
    this.api.getFolders()
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
    })
  }

  viewFolder(row:any){
    this.router.navigate([`/folder-single/${row}`]);
    console.log('View sheet-single:', row);
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
    /*this.api.deleteFolder(id)
    .subscribe({
      next:(res)=>{
        this._snackBar.open('Element supprimé avec succès', '', {
                duration: 2000,
                
        });
      
        this.getAllFolders();
      },
      error:()=>{
        alert("Erreur pendant la suppression!!");
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
