import { Component, OnInit } from '@angular/core';
import { Classeur } from '../classeur';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseurService } from '../../../shared/services/classeur.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-classeur-edition',
  template: `
    <!--<h1>Modifier une facture</h1>
    <p class="alert bg-info text-white">
      Remplissez les informations de la facture afin de la retrouver dans votre
      liste plus tard !
    </p>
    <p class="alert bg-warning text-white" *ngIf="errorMessage">
      {{ errorMessage }}
    </p>-->
    <app-classeur-form
      *ngIf="classeur$ | async as classeur"
      [classeur]="classeur"
      (classeur-submit)="onSubmit($event)"
    ></app-classeur-form>
  `,
  styleUrls: ['classeur-edition.component.scss'],
})
export class ClasseurEditionComponent implements OnInit {
  errorMessage = '';
  classeur?: Classeur;

  // L'observable qui contiendra dans le futur la facture récupérée sur Xano
  classeur$?: Observable<Classeur>;
  classeurId?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private classeurService: ClasseurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Notre observable classeur$ sera le résultat de l'observable ParamMap de la route,
    // qui à chaque évolution, sera transformé en un identifiant, puis en la facture qui
    // correspond à l'identifiant

    this.classeur$ = this.activatedRoute.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      tap((id) => (this.classeurId = +id!)),
      switchMap((id) => this.classeurService.find(+id!))
    );
    // .subscribe((classeur: any) => {
    //   console.log('classeur EDITION COMPONENT');
    //   console.log(classeur);
    //   this.classeur = classeur;
    //console.log('this.classeur', this.classeur);
    //});

    console.log('this.classeur$ :', this.classeur$);
  }

  onSubmit(classeur: Classeur) {
    // On récupère les informations de la facture et on y ajoute l'identifiant
    console.log('UPDATE classeur');
    const uptatedClasseur = { ...classeur, id: this.classeurId };

    this.classeurService.update(uptatedClasseur).subscribe({
      next: () => this.router.navigate(['../classeurs']),
      error: () =>
        (this.errorMessage =
          "Une erreur est survenue lors de l'enregistrement de la facture, veuillez réessayer plus tard :)"),
    });
  }

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
