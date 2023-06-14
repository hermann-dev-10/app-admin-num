import { Component, OnInit } from '@angular/core';
import { Invoice } from '../invoice';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../shared/services/invoice.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-test',
  template: `
    <!--<h1>Modifier une facture</h1>
    <p class="alert bg-info text-white">
      Remplissez les informations de la facture afin de la retrouver dans votre
      liste plus tard !
    </p>
    <p class="alert bg-warning text-white" *ngIf="errorMessage">
      {{ errorMessage }}
    </p>-->
    <app-invoice-form
      *ngIf="invoice$ | async as invoice"
      [invoice]="invoice"
      (invoice-submit)="onSubmit($event)"
    ></app-invoice-form>
    <p>--------------------</p>
    <div class="container" *ngIf="invoice$; as: invoice; else: fallBack">
      <div id="test-export-pdf">
        <br />
        <div class="row container-invoice">
          <div class="col-xs-12 col-md-6 text-left">
            <img
              src="./../../../../assets/logo_LM.png"
              width="150"
              alt="Sekoia Services SA"
            />
            <p>LM Services Sàrl</p>
            <p>Rue Arnold Winkelried 6</p>
            <p>1201 Genève</p>
            <p>+ 41 79 128 52 93</p>
            <p>Contact@lmservices-sarl.com</p>
            <p>TVA: CHE-470.914.806</p>
          </div>
          <div class="col-xs-12 col-md-6t text-right">
            <p>Facture</p>
            <p>
              Date :
              {{ invoice.created_at | date : 'dd/MM/yyyy' : undefined : 'fr' }}
            </p>
            <p>Reférence : 062023</p>
            <p>Nom client : {{ invoice.customer_name }}</p>
            <p>Rue de la gare 10</p>
            <p>1200 Genève</p>
          </div>
        </div>
        <br /><br />
        <br /><br />
        <table class="table container-invoice">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Description</th>
              <th scope="col">Quantité (Nb d'heure)</th>
              <th scope="col">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of invoice.details; let index = index">
              <th scope="row">{{ index }}</th>
              <td>{{ data.description }}</td>
              <td>{{ data.quantity }}h</td>
              <td>{{ data.amount }} CHF</td>
            </tr>
          </tbody>
        </table>

        <div class="row container-invoice">
          <div class="col-xs-12 col-md-6 text-left">
            <h4 *ngIf="invoice.status === 'SENT'">
              État facture : <span class="badge bg-dark">Envoyé</span>
            </h4>

            <h4 *ngIf="invoice.status === 'PAID'">
              État facture : <span class="badge bg-success">Payé</span>
            </h4>

            <h4 *ngIf="invoice.status === 'CANCELED'">
              État facture : <span class="badge bg-danger">Annulé</span>
            </h4>
          </div>

          <!-- <h4 class="col-xs-12 col-md-6 text-right">
            
          </h4>  -->

          <!-- <app-invoice-form-totals
                  [total]="total"
                ></app-invoice-form-totals>  -->
        </div>
        <!-- <p> {{ totalTTC | currency : 'CHF' : 'symbol' : undefined : 'fr' }}</p> -->
        <br /><br />
        <br /><br />
      </div>
      <div class="row">
        <div class="text-center">
          <button class="btn btn-primary mr-15" (click)="goBack()">
            Retour à la liste
          </button>

          <button class="btn btn-danger" (click)="openPDF(invoice)">
            Exporter
          </button>
        </div>
      </div>
    </div>

    <ng-template #fallBack>
      <h3>Une erreur est survenue aucun document trouvé</h3>
      <a [routerLink]="['../..']" class="btn btn-primary"
        >Retourner à la liste</a
      >
    </ng-template>
  `,
  styleUrls: ['invoice-test.component.scss'],
})
export class InvoiceTestComponent implements OnInit {
  errorMessage = '';
  invoice?: Invoice;

  // L'observable qui contiendra dans le futur la facture récupérée sur Xano
  invoice$?: Observable<Invoice>;
  invoiceId?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Notre observable invoice$ sera le résultat de l'observable ParamMap de la route,
    // qui à chaque évolution, sera transformé en un identifiant, puis en la facture qui
    // correspond à l'identifiant

    this.invoice$ = this.activatedRoute.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      tap((id) => (this.invoiceId = +id!)),
      switchMap((id) => this.invoiceService.find(+id!))
    );
    // .subscribe((invoice: any) => {
    //   console.log('INVOICE EDITION COMPONENT');
    //   console.log(invoice);
    //   this.invoice = invoice;
    //console.log('this.invoice', this.invoice);
    //});

    console.log('this.invoice$ :', this.invoice$);
  }

  onSubmit(invoice: Invoice) {
    // On récupère les informations de la facture et on y ajoute l'identifiant
    console.log('UPDATE INVOICE');
    const uptatedInvoice = { ...invoice, id: this.invoiceId };

    this.invoiceService.update(uptatedInvoice).subscribe({
      next: () => this.router.navigate(['../invoices']),
      error: () =>
        (this.errorMessage =
          "Une erreur est survenue lors de l'enregistrement de la facture, veuillez réessayer plus tard :)"),
    });
  }

//   get details() {
//     return this.invoiceForm.controls.details;
//   }

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
