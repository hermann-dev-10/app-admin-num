import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InvoiceFormType } from './invoice-form-type';

@Component({
  selector: 'app-invoice-form-general',
  template: `
    <div class="row" [formGroup]="parent" *ngIf="parent">
      <div class="col-4">
        <label for="description">Description de la facture</label>
        <input
          formControlName="description"
          [class.is-invalid]="description?.touched && description?.invalid"
          type="text"
          id="description"
          name="description"
          placeholder="Description de la facture"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">
          La description est obligatoire et doit faire au moins 3 caractères !
        </p>
      </div>
      <div class="col-4">
        <label for="customer_name">Client</label>
        <input
          formControlName="customer_name"
          [class.is-invalid]="customerName?.touched && customerName?.invalid"
          type="text"
          id="customer_name"
          name="customer_name"
          placeholder="Nom du client / la société"
          class="form-control mb-3"
        />
        <p class="invalid-feedback">
          Le client est obligatoire et doit faire au moins 3 caractères !
        </p>
      </div>
      <div class="col-4">
        <label for="status">Statut</label>
        <select
          formControlName="status"
          name="status"
          id="status"
          class="form-control mb-3"
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELED">Annulée</option>
        </select>
      </div>
      <div class="col-4">
        <label for="customer_name">Date</label>

      
        <input type="date" class="form-control mb-3"
         formControlName="created_at"> 
        
    
        <!-- <mat-form-field appearance="fill">
          <mat-label>Choose a date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="created_at"
          />
          <mat-hint>MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field> -->
      </div>
    </div>
  `,
  styles: [],
})
export class InvoiceFormGeneralComponent {
  @Input()
  parent?: InvoiceFormType;

  get customerName() {
    return this.parent?.controls.customer_name;
  }

  get description() {
    return this.parent?.controls.description;
  }
}
