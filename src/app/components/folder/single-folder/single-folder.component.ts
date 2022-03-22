import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-single-folder',
  templateUrl: './single-folder.component.html',
  styleUrls: ['./single-folder.component.scss']
})
export class SingleFolderComponent implements OnInit {

  product: any | undefined;
  buttonText!:string;

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id']; //get the id //string litteral access //paramettre de type string //type cast -> tranform chaine caracter on number
    this.product = this.apiService.getProductById(id);
    this.getProductById();
  }

  getProductById(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getProductById(id)
    .subscribe(product => this.product = product);
  }

  goBack(): void {
    this.location.back();
  }

}
