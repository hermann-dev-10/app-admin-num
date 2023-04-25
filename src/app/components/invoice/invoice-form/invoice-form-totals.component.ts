import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-form-totals',
  template: `
    <div class="row">
      <div class="col-6 text-end">Total HT :</div>
      <div class="col" id="total_ht">
        {{ total | currency : 'CHF' : 'symbol' : undefined : 'fr' }}
      </div>
    </div>

    <div class="row">
      <div class="col-6 text-end">Total TVA :</div>
      <div class="col" id="total_tva">
        {{ totalTVA | currency : 'CHF' : 'symbol' : undefined : 'fr' }}
      </div>
    </div>
    <div class="row fw-bold">
      <div class="col-6 text-end">Total TTC :</div>
      <div class="col" id="total_ttc">
        {{ totalTTC | currency : 'CHF' : 'symbol' : undefined : 'fr' }}
      </div>
    </div>
  `,
  styles: [],
})
export class InvoiceFormTotalsComponent {
  @Input()
  total = 0;

  get totalTVA() {
    return this.total * 0.2;
  }

  get totalTTC() {
    return this.total + this.totalTVA;
  }
}
