import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { Location } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { UserService } from 'src/app/shared/services/user.service';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export interface PeriodicElement {
  date: string;
  numeriseur: string;
  partie: string;
  etat: string;
  visa: string;
  name_file: string;
  name_folder: string;
}
@Component({
  selector: 'app-single-folder',
  templateUrl: './single-folder.component.html',
  styleUrls: ['./single-folder.component.scss'],
})
export class SingleFolderComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  @ViewChild('htmlData') htmlData!: ElementRef;
  //@ViewChild('content', {static:false}) el!: ElementRef;
  //singleFolder!:any;
  singleFolder: any | undefined;
  //folder: any | undefined;
  buttonText!: string;
  name: string;
  position: number;
  weight: number;
  symbol: string;
  displayedColumns: string[] = [
    'nomClient',
    'nomClasseur',
    'directory',
    'month',
    'year',
    'state',
    'comment',
  ];
  //dataSource = ELEMENT_DATA;
  sideBarOpen = true;
  sub: any;
  displayNameObs:any;
  user:any;


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
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; //get the id //string litteral access //paramettre de type string //type cast -> tranform chaine caracter on number
    //const id = +this.route.snapshot.params['id']; //get the id //string litteral access //paramettre de type string //type cast -> tranform chaine caracter on number
    this.apiService
      .getFolderById(id)
      .subscribe((singleFolder) => (this.singleFolder = singleFolder));
    /*this.folder = this.apiService.getFolderById(id);
    this.getFolderById();
    console.log('this.folder', this.folder);
    console.log('this.getFolderById();', this.getFolderById());*/

    this.sub = this.afAuth.authState.subscribe((user: any) => {
      console.log('USER-UID', this.userService.readUserWithUid(user.uid));
      this.user = user;

      if (this.user) {
        console.log(this.userService.readUserWithUid(user.uid));

        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          //Question : à propos de this.sub que j'ai écrit 2 fois
          (data) => {
            //console.log('ngOnInt readUserWithUID / data', data);
            //this.uniqueUser = data;
            //console.log('ngOnInt readUserWithUID / data', data);
            //this.uniqueUser = data;
            //console.log('user data : -> ', this.user);
            //console.log('mes users$ OBSERVABLE : -> ', this.users$);
            this.displayNameObs = data;
            //console.log('this.displayNameObs :', this.displayNameObs)
            /*if (!data || data.length === 0) {
                console.log(`Creating a new personal user for ${user.displayName}`);
                this.userService.createUser(this.uniqueUser);
              }*/
          },
          (err) => {
            console.error('readUserWithUID error', err);
          }
        );
      }
    });
  }

  getFolderById(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    //this.apiService.getFolderById(id)
    //.subscribe(folder => this.folder = folder);
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
      PDF.save('Fiche_suivi_' + `${this.singleFolder.nomClasseur}` + '.pdf');
    });
  }

  /*makePdf(){
    let pdf = new jsPDF()
    pdf.html(this.el.nativeElement, {
      callback: (pdf)=> {
        pdf.save('sample.pdf')
      }
    })
  }*/

  /*public openPDF():void {
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();
  }*/

  goBack(): void {
    this.location.back();
  }
}