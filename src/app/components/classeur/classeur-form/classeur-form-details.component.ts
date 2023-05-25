import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ClasseurFormType } from './classeur-form-type';

@Component({
  selector: 'app-classeur-form-details',
  template: `
    <ng-container [formGroup]="parent" *ngIf="parent && details">
      <div class="alert bg-warning text-white" *ngIf="details.length === 0">
        <p>Vous devez ajouter des détails à votre classeur</p>
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
            <div class="col-3">
              <mat-form-field class="example-full-width">
                <mat-label>Nom du fichier</mat-label>
                <input
                  formControlName="file_name"
                  name="file_name_{{ i }}"
                  id="file_name_{{ i }}"
                  type="text"
                  matInput
                />
              </mat-form-field>
            </div>

            <div class="col-3">
              <mat-form-field class="example-full-width">
                <mat-label>Nom du dossier</mat-label>

                <input
                  formControlName="folder_name"
                  name="folder_name{{ i }}"
                  id="folder_name{{ i }}"
                  type="text"
                  matInput
                />
              </mat-form-field>
            </div>

            <div class="col-3">
              <mat-form-field class="example-full-width">
                <mat-label>Auteur</mat-label>

                <input
                  formControlName="author"
                  name="author{{ i }}"
                  id="author{{ i }}"
                  type="text"
                  matInput
                />
              </mat-form-field>
            </div>

            <div class="col-2">
              <mat-form-field class="example-full-width">
                <mat-label>Date</mat-label>

                <input
                  formControlName="date"
                  name="date{{ i }}"
                  id="date{{ i }}"
                  type="date"
                  matInput
                />
              </mat-form-field>
            </div>

            <div class="col-1">
              <br />
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
  styleUrls: ['classeur-form-details.component.scss'],
})
export class ClasseurFormDetailsComponent {
  @Input('parent') parent?: ClasseurFormType;

  @Output('add-detail') detailsAddedEvent = new EventEmitter();

  @Output('remove-detail') removeDetailEvent = new EventEmitter<number>();

  get details() {
    return this.parent?.controls.details;
  }
}
