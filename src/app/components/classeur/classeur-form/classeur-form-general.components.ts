import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ClasseurFormType } from './classeur-form-type';

@Component({
  selector: 'app-classeur-form-general',
  template: `
    <!-- <div class="row">
      <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>City</mat-label>
          <input matInput placeholder="Ex. San Francisco" />
        </mat-form-field>
      </div>
    </div> -->

    <div class="row" [formGroup]="parent" *ngIf="parent">
      <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>Nom du classeur</mat-label>
          <input
            formControlName="binder_name"
            [class.is-invalid]="binder_name?.touched && binder_name?.invalid"
            type="text"
            id="binder_name"
            name="binder_name"
            matInput
          />
        </mat-form-field>
      </div>
      <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>Description du classeur</mat-label>
          <input
            formControlName="description"
            type="text"
            id="description"
            name="description"
            matInput
          />
        </mat-form-field>
      </div>
      <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>Client</mat-label>
          <mat-select
            formControlName="customer_name"
            type="text"
            id="customer_name"
            name="customer_name"
          >
            <mat-option>Choississez un client</mat-option>
            <mat-option *ngFor="let client of clients" value="{{ client }}">
              {{ client }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>Statut</mat-label>
          <mat-select
            formControlName="status"
            type="text"
            id="status"
            name="status"
            placeholder="Indiquer le statut du classeur"
          >
            <mat-option>Choisissez un statut</mat-option>
            <mat-option value="NOT_STARTED">Pas commencé</mat-option>
            <mat-option value="PROGRESSING">En cours</mat-option>
            <mat-option value="DONE">Terminé</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>Date du classeur</mat-label>

          <input
            matInput
            formControlName="date_binder_creation"
            [matDatepicker]="releasedAtPicker"
            (click)="releasedAtPicker.open()"
          />

          <mat-datepicker-toggle matSuffix [for]="releasedAtPicker">
          </mat-datepicker-toggle>

          <mat-datepicker #releasedAtPicker> </mat-datepicker>
        </mat-form-field>
      </div>

      <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>Répertoire du classeur</mat-label>
          <input
            formControlName="directory"
            type="text"
            id="directory"
            name="directory"
            matInput
          />
        </mat-form-field>
      </div>
      <!-- <div class="col-4">
        <mat-form-field class="example-full-width">
          <mat-label>Répertoire du classeur</mat-label>
          <input
            formControlName=""
            type="file"
            id="description"
            name="description"
            matInput
          />
        </mat-form-field>
      </div> -->
      <!-- <div class="col-4">
        <input type="file" (change)="handleUpload($event)" />
      </div> -->

      <!--<div class="col-4">
        <input
          type="file"
          class="fileControlInput"
          multiple="multiple"
          accept=".png,.jpge/*"
          (change)="getFiledetials($event.target)"
        />
      </div>-->

      <div class="col-4">
        <!--<mat-label>Répertoire du classeur</mat-label>

        <input
          type="file"
          class="file-input"
          (change)="getFiledetials($event.target)"
          #fileUpload
        /> 

        <div class="file-upload">
          {{ fileName || "Aucun fichier n'a encore été téléchargé." }}

          <button
            mat-mini-fab
            type="file"
            color="primary"
            class="upload-btn"
            (change)="getFiledetials($event.target)"
            (click)="fileUpload.click()"
            #fileUpload
          >
            <mat-icon>attach_file</mat-icon>
          </button>
        </div> -->
      </div>
    </div>
  `,
  styleUrls: ['classeur-form-general.components.scss'],
})
export class ClasseurFormGeneralComponent {
  @Input()
  parent?: ClasseurFormType;
  clients: string[] = ['FOJ', 'Centre Espoir', 'IDQ', 'Autres'];
  logo: string;

  handleUpload(e): void {
    this.logo = e.target.value;
  }

  get customerName() {
    return this.parent?.controls.customer_name;
  }

  get description() {
    return this.parent?.controls.description;
  }

  getFiledetials(element) {
    console.log(element.value);
  }
}
