import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ClasseurFormType } from './classeur-form-type';

@Component({
  selector: 'app-classeur-form-general',
  template: `
    <div class="row" [formGroup]="parent" *ngIf="parent">
      <div class="col-4">
        <label for="binder_name">Nom du classeur</label>
        <input
          formControlName="binder_name"
          [class.is-invalid]="binder_name?.touched && binder_name?.invalid"
          type="text"
          id="binder_name"
          name="binder_name"
          placeholder="Nom du classeur"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">
          Le nom du classeur est obligatoire et doit faire au moins 3 caractères
          !
        </p>
      </div>
      <div class="col-4">
        <label for="description">Description du classeur</label>
        <input
          formControlName="description"
          [class.is-invalid]="description?.touched && description?.invalid"
          type="text"
          id="description"
          name="description"
          placeholder="Description du classeur"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">
          La description est obligatoire et doit faire au moins 3 caractères !
        </p>
      </div>
      <div class="col-4">
        <label for="customer_name">Client</label>
        <!--<mat-form-field appearance="outline">
                    <mat-label>Client</mat-label>
                    <mat-select formControlName="customer_name">
                        <mat-option>Choisissez un client</mat-option>
                        <mat-option  *ngFor="let company of this.testCompanies let i = index" value="{{company.uid}} ">{{company.name}}</mat-option>
                        <mat-option value="Année inconnu">Client non renseigné</mat-option>
                    </mat-select>   
        </mat-form-field>-->
        <select
          formControlName="customer_name"
          [class.is-invalid]="customerName?.touched && customerName?.invalid"
          type="text"
          id="customer_name"
          name="customer_name"
          placeholder="Nom du client / la société"
          class="form-control mb-3"
        >
          <option value="">Choisissez un client</option>
          <option *ngFor="let client of clients" value="{{ client }}">
            {{ client }}
          </option>
        </select>
        <p class="invalid-feedback">Le nom du client est obligatoire !</p>
      </div>
      <div class="col-4">
        <label for="status">Statut</label>
        <select
          formControlName="status"
          name="status"
          id="status"
          class="form-control mb-3"
        >
          <option value="NOT_STARTED">Pas commencé</option>
          <option value="PROGRESSING">En cours</option>
          <option value="DONE">Terminé</option>
        </select>
      </div>
      <div class="col-4">
        <label for="customer_name">Date</label>

        <input
          type="date"
          class="form-control mb-3"
          formControlName="created_at"
        />
      </div>
    </div>
  `,
  styles: [],
})
export class ClasseurFormGeneralComponent {
  @Input()
  parent?: ClasseurFormType;

  clients: string[] = ['FOJ', 'Centre Espoir', 'IDQ', 'Autres'];

  get customerName() {
    return this.parent?.controls.customer_name;
  }

  get description() {
    return this.parent?.controls.description;
  }
}
