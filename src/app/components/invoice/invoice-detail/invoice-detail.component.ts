import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Invoice } from '../invoice';
import { InvoiceService } from '../../../shared/services/invoice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-detail',
  template: `
    <div>
      <div id="test-export-pdf" *ngIf="invoice; as: invoice; else: fallBack">
        <br />
        <div class="row container-invoice">
          <div class="col-xs-12 col-md-6 text-left">
            <img
              src="https://hm-dev.com/img/hm_dev_logo.png"
              width="100"
              alt="H.M Dev"
            />
            <p>HM-DEV</p>
          </div>
          <div class="col-xs-12 col-md-6t text-right">Facture</div>
        </div>
        <br />

        <div class="row text-right container-invoice">
          <!--<div>Reférence:</div>-->
          <div>
            Date :
            {{ invoice.created_at | date : 'dd/MM/yyyy' : undefined : 'fr' }}
          </div>
          <!--<div>Numéro facture:</div>-->
        </div>

        <br /><br />

        <div class="row container-invoice">
          <div class="col-xs-12 col-md-6 text-left"></div>
          <div class="col-xs-12 col-md-6 text-right">
            Nom client : {{ invoice.customer_name }}
          </div>
          <!--<div class="col-xs-12 col-md-6 text-left">Adresse Entreprise:</div>
          <div class="col-xs-12 col-md-6 text-right">Adresse Client</div>
          <div class="col-xs-12 col-md-6 text-left">NPA/Ville Entreprise:</div>
          <div class="col-xs-12 col-md-6 text-right">NPA/Ville Client</div>
          <div class="col-xs-12 col-md-6 text-left"></div>
          <div class="col-xs-12 col-md-6 text-right">TVA</div>-->
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

          <h4 class="col-xs-12 col-md-6 text-right">
            Total : {{ invoice.total | currency : 'CHF' }}
          </h4>
        </div>
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
  styles: [
    '.text-left { text-align: left; } .text-right { text-align: right; } .container-invoice{margin-left:75px;margin-right:75px} .mr-15{margin-right:15px}',
  ],
})
export class InvoiceDetailComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  @ViewChild('htmlData') htmlData!: ElementRef;
  invoice!: Invoice;

  singleInvoice: any | undefined;

  invoiceId?: number;
  invoiceForm: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.invoiceService
      .find(id)
      .subscribe((invoice: any) => (this.invoice = invoice));

    console.log('id:', id);
  }

  public openPDF(invoice: Invoice): void {
    // On récupère les informations de la facture et on y ajoute l'identifiant
    const uptatedInvoice = { ...invoice, id: this.invoiceId };

    let DATA: any = document.getElementById('test-export-pdf');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Facture_' + `${this.invoice.customer_name}` + '.pdf');
    });
  }

  public goBack() {
    this.router.navigate(['/invoices']);
  }

  get total() {
    console.log('this.details.value', this.details.value);
    return this.details.value.reduce((itemTotal: number, item) => {
      return itemTotal + item.amount * item.quantity;
    }, 0);
  }

  get details() {
    return this.invoiceForm.controls.details;
  }

  get totalTVA() {
    return this.total * 0.2;
  }

  get totalTTC() {
    return this.total + this.totalTVA;
  }

  public exportInvoice() {
    const doc = new jsPDF();

    autoTable(doc, {
      body: [
        [
          {
            //content: this.getLogo(),
            content: 'LM Services',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#000',
            },
          },
          {
            content: 'Facture',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#000',
            },
          },
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#D0D0D0',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content:
              'Reférence: #FA0001' + '\nDate: 27-01-2022' + `\nNuméro facture:`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content:
              '\nClient' + '\nAdresse 1' + '\nCode postale - Ville' + '\nPays',
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              /*'Shipping address:' +
              '\nJohn Doe' +
              '\nShipping Address line 1' +
              '\nShipping Address line 2' +
              '\nZip code - City' +*/
              '\n',
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              '\nLM-Services Sàrl' +
              '\nRue Arnold Winkelried 6' +
              '\n1201 Genève' +
              '\nTVA: CHE-470.914.506',
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        /*[
          {
            content: 'Montant dû:',
            styles: {
              halign: 'right',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content: 'CHF 4000',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#3366ff',
            },
          },
        ],
        [
          {
            content: 'Due date: 01-02-2022',
            styles: {
              halign: 'right',
            },
          },
        ],*/
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Services',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [['Elements', 'Catégorie', 'Quantité', 'Prix', 'Tax', 'Montant']],
      body: [
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: '#D0D0D0',
        textColor: '#000',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'Sous-total: CHF 3600',
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: ':',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'Total tax : CHF 400',
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'Montant total: CHF 4000',
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Terms & notes',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content:
              'orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia' +
              'molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum' +
              'numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium',
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: ' ',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: ' ',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: ' ',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'IBAN : CH29 0078 8000 0509 1317 6',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content:
              '+41 79 128 52 93 - contact@lm-services.ch - lm-services.ch',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    return doc.save(`Facture_num`);
  }
}
