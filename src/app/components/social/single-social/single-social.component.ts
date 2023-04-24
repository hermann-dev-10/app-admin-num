import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { Location } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
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
  selector: 'app-single-social',
  templateUrl: './single-social.component.html',
  styleUrls: ['./single-social.component.scss']
})
export class SingleSocialComponent implements OnInit {

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
  displayedColumns: string[] = ['nomClient', 'nomClasseur', 'directory', 'month', 'year', 'state', 'comment'];
  //dataSource = ELEMENT_DATA;
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; //get the id //string litteral access //paramettre de type string //type cast -> tranform chaine caracter on number
    //const id = +this.route.snapshot.params['id']; //get the id //string litteral access //paramettre de type string //type cast -> tranform chaine caracter on number
    this.apiService.getFolderById(id)
      .subscribe(singleFolder => this.singleFolder = singleFolder);
    /*this.folder = this.apiService.getFolderById(id);
    this.getFolderById();
    console.log('this.folder', this.folder);
    console.log('this.getFolderById();', this.getFolderById());*/
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