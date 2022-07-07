import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { Location } from '@angular/common';

export interface PeriodicElement {
  date: string;
  numeriseur: string;
  partie: string;
  etat: string;
  visa: string;
  name_file: string;
  name_folder: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {date: "1/3/2022", numeriseur: 'Stéphane', partie: "1", etat: 'en cours', visa: 'SV', name_file: 'Créanciers', name_folder: 'a'},
  {date: "1/3/2022", numeriseur: 'Hermann', partie: "2", etat: 'en cours', visa: 'HM', name_file: 'Créanciers', name_folder: 'b'},
  {date: "1/3/2022", numeriseur: 'Elvina', partie: "3/3", etat: 'terminé', visa: 'E', name_file: 'Créanciers', name_folder: 'c'},
];

@Component({
  selector: 'app-single-folder',
  templateUrl: './single-folder.component.html',
  styleUrls: ['./single-folder.component.scss']
})
export class SingleFolderComponent implements OnInit {

  //singleFolder!:any;
  singleFolder: any | undefined;

  //folder: any | undefined;
  buttonText!:string;
  name: string;
  position: number;
  weight: number;
  symbol: string;
  //displayedColumns: string[] = ['date', 'numeriseur', 'partie', 'etat', 'visa', 'name_file', 'name_folder'];
  //displayedColumns: string[] = ['nomClasseur', 'directory', 'date', 'comment', 'action'];
  displayedColumns: string[] = ['nomClasseur', 'directory', 'date', 'etat', 'comment'];
  dataSource = ELEMENT_DATA;

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

  goBack(): void {
    this.location.back();
  }
}
