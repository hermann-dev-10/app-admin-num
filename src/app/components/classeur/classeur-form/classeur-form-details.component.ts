import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ClasseurFormType } from './classeur-form-type';

@Component({
  selector: 'app-classeur-form-details',
  template: `
    <ng-container [formGroup]="parent" *ngIf="parent && details">
      <!--<h3>Détails du classeur</h3>-->
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
        <h5>Détails</h5>

        <div
          class="detail-row"
          [formGroup]="group"
          *ngFor="let group of details.controls; let i = index"
        >
          <div class="row mb-3">
            <div class="col-5">
              <label>Nom du fichier</label>
              <input
                formControlName="file_name"
                [class.is-invalid]="
                  group.controls.file_name.touched &&
                  group.controls.file_name.invalid
                "
                name="file_name_{{ i }}"
                id="file_name_{{ i }}"
                type="text"
                placeholder="Nom du fichier"
                class="form-control"
              />
              <p class="invalid-feedback">
                Le nom du fichier est obligatoire !
              </p>
            </div>

            <div class="col-5">
              <label>Nom du dossier</label>

              <input
                formControlName="folder_name"
                [class.is-invalid]="
                  group.controls.folder_name.touched &&
                  group.controls.folder_name.invalid
                "
                name="folder_name{{ i }}"
                id="folder_name{{ i }}"
                type="text"
                placeholder="Nom du dossier"
                class="form-control"
              />
              <p class="invalid-feedback">
                Le nom du dossier est obligatoire !
              </p>
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
export class ClasseurFormDetailsComponent {
  @Input('parent') parent?: ClasseurFormType;

  @Output('add-detail') detailsAddedEvent = new EventEmitter();

  @Output('remove-detail') removeDetailEvent = new EventEmitter<number>();

  get details() {
    return this.parent?.controls.details;
  }
}
