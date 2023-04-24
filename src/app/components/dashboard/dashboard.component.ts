import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FolderService } from 'src/app/shared/services/folder.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  sideBarOpen = true;
  folders$: Observable<any[]>


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private folderService: FolderService,  ) { }

  ngOnInit(): void {
    this.folders$ = this.folderService.getFolders();

  }

}
