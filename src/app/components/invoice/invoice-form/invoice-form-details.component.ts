import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { InvoiceFormType } from './invoice-form-type';

@Component({
  selector: 'app-invoice-form-details',
  template: `
    <ng-container [formGroup]="parent" *ngIf="parent && details">
      <!--<h3>Détails de la facture</h3>-->
      <div class="alert bg-warning text-white" *ngIf="details.length === 0">
        <p>Vous pouvez ajouter des détails à votre facture</p>
        <button
          type="button"
          class="btn btn-sm btn-outline-light"
          (click)="detailsAddedEvent.emit()"
          id="add-detail-initial"
        >
          + Ajouter ma première ligne
        </button>
      </div>
      <section formArrayName="details">
        <div
          class="detail-row"
          [formGroup]="group"
          *ngFor="let group of details.controls; let i = index"
        >
          <div class="row mb-3">
            <div class="col-7">
              <label for="description">Description</label>
              <input
                formControlName="description"
                [class.is-invalid]="
                  group.controls.description.touched &&
                  group.controls.description.invalid
                "
                name="description_{{ i }}"
                id="description_{{ i }}"
                type="text"
                placeholder="Description"
                class="form-control"
              />
              <p class="invalid-feedback">
                La description est obligatoire et doit faire au moins 5
                caractères !
              </p>
            </div>
            <div class="col-2">
              <label for="amount">Montant</label>

              <input
                formControlName="amount"
                [class.is-invalid]="
                  group.controls.amount.touched && group.controls.amount.invalid
                "
                name="amount_{{ i }}"
                id="amount_{{ i }}"
                type="number"
                placeholder="Montant"
                class="form-control"
              />
              <p class="invalid-feedback">Le montant est obligatoire</p>
            </div>
            <div class="col-2">
              <label for="quantity">Quantité</label>

              <input
                formControlName="quantity"
                [class.is-invalid]="
                  group.controls.quantity.touched &&
                  group.controls.quantity.invalid
                "
                type="number"
                placeholder="Quantité"
                class="form-control"
              />
              <p class="invalid-feedback">La quantité est obligatoire</p>
            </div>
            <div class="col-1">
              <br>
              <button
                type="button"
                class="btn w-auto d-block btn-sm btn-danger"
                (click)="removeDetailEvent.emit(i)"
                id="remove-detail-{{ i }}"
              >
                X
              </button>
            </div>
          </div>
        </div>
        <button
          *ngIf="details.length > 0"
          class="btn btn-primary btn-sm"
          type="button"
          (click)="detailsAddedEvent.emit()"
          id="add-detail"
        >
          + Ajouter une ligne
        </button>
      </section>
    </ng-container>
  `,
  styles: [],
})
export class InvoiceFormDetailsComponent {
  @Input('parent') parent?: InvoiceFormType;

  @Output('add-detail') detailsAddedEvent = new EventEmitter();

  @Output('remove-detail') removeDetailEvent = new EventEmitter<number>();

  get details() {
    return this.parent?.controls.details;
  }
}
