import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Classeur } from '../classeur';
import { ClasseurService } from '../../../shared/services/classeur.service';

@Component({
  selector: 'app-classeur-creation',
  template: `
    <div>
      <!--<h1>Créer un nouveau classeur</h1>
      <p class="alert bg-info text-white">
        Remplissez les informations de du classeur afin de la retrouver dans
        votre liste plus tard !
      </p>
      <p class="alert bg-warning text-white" *ngIf="errorMessage">
        {{ errorMessage }}
      </p>-->

      <app-classeur-form
        (classeur-submit)="onSubmit($event)"
      ></app-classeur-form>
    </div>
  `,
  styles: [],
})
export class ClasseurCreationComponent implements OnInit {
  errorMessage = '';
  ngOnInit(): void {}

  constructor(
    private service: ClasseurService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(classeurData: Classeur) {
    console.log('Submit classeur? : ', classeurData);
    this.service.postClasseur(classeurData).subscribe({
      next: () =>
        this.router.navigate(['../'], {
          relativeTo: this.route,
        }),
      error: (error: any) =>
        (this.errorMessage =
          'Une erreur est survenue, merci de réessayer plus tard'),
    });
    console.log('classeurData : ', classeurData);
  }
}
