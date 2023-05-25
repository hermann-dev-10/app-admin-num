import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { Location } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { UserService } from 'src/app/shared/services/user.service';
import { LeaveRequestService } from 'src/app/shared/services/leave-request.service';
import { Subscription } from 'rxjs';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-demande-conge-single',
  templateUrl: './demande-conge-single.component.html',
  styleUrls: ['./demande-conge-single.component.scss'],
})
export class DemandeCongeSingleComponent implements OnInit {
  singleLeaveRequest: any | undefined;
  sideBarOpen = true;
  sub!: Subscription;
  user: any;
  displayNameObs: any;
  displayName: any;
  type: any;
  description: any;
  responsable: any;
  status: any;
  start_date: any;
  end_date: any;
  created_at: any;
  managed_by: any;
  managed_date: any;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private apiService: ApiService,
    private afAuth: AngularFireAuth,
    public userService: UserService,
    private leaveRequestService: LeaveRequestService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          (data) => {
            this.displayNameObs = data;

            for (let i = 0; i < this.displayNameObs.length; i++) {
              this.displayName = this.displayNameObs[i].displayName;
              console.log('data', data);
            }
          },
          (err) => {
            console.error('readUserWithUID error', err);
          }
        );

        this.sub = this.leaveRequestService
          .readPersonalByUid(user.uid)
          .subscribe(
            (data) => {
              this.displayNameObs = data;

              for (let i = 0; i < this.displayNameObs.length; i++) {
                this.type = this.displayNameObs[i].type;
                this.description = this.displayNameObs[i].description;
                this.status = this.displayNameObs[i].status;
                this.responsable = this.displayNameObs[i].responsable;
                this.start_date = this.displayNameObs[i].start_date;
                this.end_date = this.displayNameObs[i].end_date;
                this.created_at = this.displayNameObs[i].created_at;
                this.managed_by = this.displayNameObs[i].managed_by; //I use the value of the user connected
                console.log('this.managed_by: ', this.managed_by);
                this.managed_date = this.displayNameObs[i].managed_date;
              }
            },
            (err) => {
              console.error('readLeaveRequestWithUID error', err);
            }
          );
      }
    });
  }

  public openPDF(): void {
    let DATA: any = document.getElementById('content');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Fiche_suivi_' + `${this.singleLeaveRequest}` + '.pdf');
    });
  }

  goBack(): void {
    this.location.back();
  }
}
