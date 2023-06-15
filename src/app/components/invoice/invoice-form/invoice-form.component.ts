import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Invoice } from '../invoice';
import { InvoiceFormType } from './invoice-form-type';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-invoice-form',
  template: `
    <mat-drawer-container>
      <mat-drawer mode="side" [opened]="sideBarOpen">
        <!-- <mat-drawer mode="side" opened="true"> -->
        <app-sidenav></app-sidenav>
      </mat-drawer>
      <mat-drawer-content>
        <app-header (toggleSidebarForMe)="sideBarToggler()"></app-header>
        <div class="container-fluid page">
          <div class="d-flex page__box p-3 mt-2">Détails de la facture</div>
          <div class="page__content shadow p-3 position-relative">
            <div class="text-center">
              <form [formGroup]="invoiceForm" (submit)="onSubmit()">
                <app-invoice-form-general
                  [parent]="invoiceForm"
                ></app-invoice-form-general>

                <hr />

                <app-invoice-form-details
                  [parent]="invoiceForm"
                  (add-detail)="onAddDetail()"
                  (remove-detail)="onRemoveDetail($event)"
                ></app-invoice-form-details>

                <hr />

                <app-invoice-form-totals
                  [total]="total"
                ></app-invoice-form-totals>

                <div class="text-center">
                  <div class="d-flex">
                    <button class="w-sm-auto btn btn-primary mr-15" id="submit">
                      Enregistrer
                    </button>

                    <a class="btn btn-secondary" routerLink="/invoices"
                      >Retour à la liste
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,

  styleUrls: ['invoice-form.component.scss'],
})
export class InvoiceFormComponent implements OnInit {
  @Output('invoice-submit') invoiceSubmitEvent = new EventEmitter<Invoice>();

  @Input() invoice?: Invoice;

  detailsExistsValidator: ValidatorFn = (control: AbstractControl) => {
    const details = control.get('details') as FormArray;

    return details.length > 0
      ? null
      : {
          noDetails: true,
        };
  };

  invoiceForm: InvoiceFormType = this.fb.group({
    customer_name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['Facture'],
    description: ['', [Validators.required, Validators.minLength(2)]],
    status: ['SENT'],
    commentaire: ['', [Validators.required, Validators.minLength(2)]],
    created_at: new Date(), //['', [Validators.required]],
    details: this.fb.array<FormGroup>([]),
  });

  /*invoiceForm: InvoiceFormType = this.fb.group(
    {
      customer_name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      status: [''],
      details: this.fb.array<
        FormGroup<{
          description: FormControl;
          amount: FormControl;
          quantity: FormControl;
        }>
      >([
        this.fb.group({
          amount: [''],
          description: [''],
          quantity: [''],
        }),
      ]),
    },
    {
      validators: this.detailsExistsValidator,
    }
  );*/

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.invoice) {
      return;
    }

    this.invoice.details.forEach((item) => this.onAddDetail());

    this.invoiceForm.patchValue(this.invoice);

    console.log('details ?: ', this.details.value);

    console.log(
      'this.invoiceForm.controls.details.value ?: ',
      this.invoiceForm.controls.details.value
    );

    console.log('TOTAL :', this.total);
  }

  get details() {
    return this.invoiceForm.controls.details;
  }

  get total() {
    console.log('this.details.value', this.details.value);
    return this.details.value.reduce((itemTotal: number, item) => {
      return itemTotal + item.amount * item.quantity;
    }, 0);
  }

  onAddDetail() {
    this.details.push(
      this.fb.group({
        description: ['', [Validators.required, Validators.minLength(3)]],
        amount: ['', [Validators.required, Validators.minLength(0)]],
        quantity: ['', [Validators.required, Validators.minLength(0)]],
      })
    );
  }

  onRemoveDetail(index: number) {
    this.details.removeAt(index);
  }

  onSubmit() {
    console.log('this.invoiceForm.value:', this.invoiceForm.value);
    if (this.invoiceForm.invalid) {
      return;
    }
    this.invoiceSubmitEvent.emit(this.invoiceForm.value as Invoice);

    console.log('Ok ADD Invoice:', this.invoiceForm.value);

    /*this.invoiceService
      .postInvoice(this.invoiceForm.value as Invoice)
      .pipe(tap(() => this.router.navigateByUrl('/invoices')))
      .subscribe();*/
  }

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
