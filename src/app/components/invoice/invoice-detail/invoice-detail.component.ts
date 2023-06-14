import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styles: [
    '.text-left { text-align: left; } .text-right { text-align: right; } .container-invoice{margin-left:75px;margin-right:75px} .mr-15{margin-right:15px}',
  ],
})
export class InvoiceDetailComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  @ViewChild('htmlData') htmlData!: ElementRef;
  invoice!: Invoice;
  //@Input() invoice?: Invoice;

  singleInvoice: any | undefined;

  invoiceId?: number;
  invoiceForm: any;
  // L'observable qui contiendra dans le futur la facture récupérée sur Xano
  invoice$?: Observable<Invoice>;

  dataTotalInvoice: any;
  compteurInvoice: any = 0;

  totalAmount: any = 0;
  amount:any = 0;
  quantity:any = 0;
  TVA: any = 0.2;
  totalTTC: any = 0;

  // detailsExistsValidator: ValidatorFn = (control: AbstractControl) => {
  //   const details = control.get('details') as FormArray;

  //   return details.length > 0
  //     ? null
  //     : {
  //         noDetails: true,
  //       };
  // };

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

    //this.invoice.details.forEach((item) => this.onAddDetail());

    //this.invoiceForm.patchValue(this.invoice);

    //console.log('details ?: ', this.details.value);

    // console.log(
    //   'this.invoiceForm.controls.details.value ?: ',
    //   this.invoiceForm.controls.details.value
    // );

    console.log('id:', id);

    //console.log('details:', this.details());
    //console.log('total:', this.total());

    //console.log('TOTAL :', this.total);
    //console.log('totalTVA :', this.totalTVA);
    //console.log('totalTTC :', this.totalTTC);
    console.log('before');
    this.invoiceService.find(id).subscribe((invoice: any) => {
      console.log('invoice.details', invoice.details);
      this.dataTotalInvoice = invoice;
     console.log('after inside');
      for (let i = 0; i < this.invoice.details.length; i++) {
        console.log('test', this.invoice.details[i].amount);
        this.amount = this.invoice.details[i].amount;
        this.quantity = this.invoice.details[i].quantity;
        this.totalAmount = this.totalAmount + (this.amount*this.quantity);
        console.log('this.totalAmount:', this.totalAmount);
        this.totalTTC = this.totalAmount + (this.totalAmount * this.TVA);

         //for (let i = 0; i < this.invoice.details.length; i++) {}
        // switch (this.dataTotalInvoice[i].amount) {
        //   case 'PROGRESSING':
        //     // statement progressing
        //     this.compteurInvoice++;
        //     break;
        //   // case 'ACCEPTED':
        //   //   // statement accepted
        //   //   this.compteurAcceptedRequest++;
        //   //   break;
        //   // case 'REFUSED':
        //   //   // statement refused
        //   //   this.compteurRefusedRequest++;
        //   //   break;
        //   default:
        //     //
        //     break;
        // }
      }
    });

    console.log('after');
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

  // get totalTTC() {
  //   return this.total + this.totalTVA;
  // }

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
