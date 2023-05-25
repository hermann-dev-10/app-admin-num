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
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { LeaveRequest } from '../leave-request/leave-request';


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

  displayedLeaveRequestsColumns: string[] = [
    'displayName',
    'type',
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

  dataSourceLeaveRequests!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorLeaveRequest!: MatPaginator;
  @ViewChild(MatSort) sortLeaveRequest!: MatSort;

  foldersByUid$!: Observable<any[]>;
  leavesByUid$!: Observable<any[]>;

  currentUser!: any;
  user = this.afAuth.currentUser;

  sub: any;
  subLeaveRequest: any;

  uniqueUser: any;
  dataUniqueUser: any;

  users$: Observable<any>[] = [];
  users: any[] = [];

  private foldersCollection: AngularFirestoreCollection<any>;
  private leaveRequestsCollection: AngularFirestoreCollection<any>;

  private userCollection: AngularFirestoreCollection<any>;

  folders$: Observable<any[]>;
  folders: any[] = [];

  leaveRequests$: Observable<LeaveRequest[]>;
  leaveRequests: LeaveRequest[] = [];
  leavesRequest: any;

  leavesPersonalRequest: LeaveRequest[] = [];
  dataTotalProgressingRequest: any;
  compteurProgressingRequest: any = 0;
  compteurAcceptedRequest: any = 0;
  compteurRefusedRequest: any = 0;

  subRequest: any;

  sideBarOpen = true;

  message: string = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';

  isSuperAdmin: any;
  isAdmin: any;

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
    private afAuth: AngularFireAuth,
    private leaveRequestService: LeaveRequestService
  ) {}

  async ngOnInit() {
    this.leaveRequestsCollection = await this.leaveRequestService.findAll();
    this.sub = this.leaveRequestsCollection
      .valueChanges({
        idField: 'id',
      })
      .subscribe((data) => {
        this.leaveRequests = data;
      });

    this.leaveRequestService.getLeaveRequests().subscribe((data: any) => {
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

    this.getAllLeaveRequests();

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;
      if (this.user) {
        this.leavesByUid$ = this.leaveRequestService.readPersonalByUid(
          user.uid
        );
        console.log('leavesByUid: ', this.leavesByUid$);
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService
          .readUserWithUid(user.uid)
          .subscribe((data) => {
            this.dataUniqueUser = data;

            for (let i = 0; i < this.dataUniqueUser.length; i++) {
              //   this.company = this.dataUniqueUser[i].company;
              //   this.createdAt = this.dataUniqueUser[i].createdAt;
              //   this.displayName = this.dataUniqueUser[i].displayName;
              //   this.email = this.dataUniqueUser[i].email;
              this.isAdmin = this.dataUniqueUser[i].isAdmin;
              this.isSuperAdmin = this.dataUniqueUser[i].isSuperAdmin;
            }

            console.log('Dossier: ngOnInit readUserWithUid / data', data);
            this.uniqueUser = data;
            console.log('user data : -> ', this.user);
            console.log('mes users$ OBSERVABLE : -> ', this.users$);
            console.log('uniqueUser: ', this.uniqueUser.isAdmin);
          });

        this.subRequest = this.leaveRequestService
          .readPersonalByUid(user.uid)
          .subscribe((data) => {
            this.leavesRequest = data;
            console.log(
              'this.leavesPersonalRequest :',
              this.leavesPersonalRequest
            );
          });
      }
    });

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

    this.leaveRequestsCollection = await this.leaveRequestService.findAll();

    this.subLeaveRequest = this.leaveRequestsCollection
      .valueChanges({
        idField: 'id',
      })
      .subscribe((data) => {
        this.leaveRequests = data;
        console.log('this.leaveRequest: ', this.leaveRequests);
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

  applyFilterLeaveRequest(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLeaveRequests.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceLeaveRequests.paginator) {
      this.dataSourceLeaveRequests.paginator.firstPage();
    }
  }

  getAllLeaveRequests() {
    this.subLeaveRequest = this.afAuth.authState.subscribe((user) => {
      this.leaveRequestService.getLeaveRequests().subscribe({
        next: (res) => {
          this.dataSourceLeaveRequests = new MatTableDataSource(res);
          this.dataSourceLeaveRequests.paginator = this.paginatorLeaveRequest;
          this.dataSourceLeaveRequests.sort = this.sortLeaveRequest;
        },
        error: (err) => {
          //alert("Erreur pendant la collection des éléments!!");
          console.log('Error While fetching the records');
        },
      });
    });
  }

  applyFilterLeaveRequests(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLeaveRequests.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceLeaveRequests.paginator) {
      this.dataSourceLeaveRequests.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subLeaveRequest.unsubscribe();
  }
}
