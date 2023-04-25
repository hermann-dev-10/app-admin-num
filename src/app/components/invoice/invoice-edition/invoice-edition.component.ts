import { Component, OnInit } from '@angular/core';
import { Invoice } from '../invoice';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../shared/services/invoice.service';
import { Observable} from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-edition',
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
  `,
  styleUrls: ['invoice-edition.component.scss'],
})
export class InvoiceEditionComponent implements OnInit {
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

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
