import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LeaveRequest } from '../leave-request';
import { LeaveRequestService } from '../../../shared/services/leave-request.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  @ViewChild('htmlData') htmlData!: ElementRef;
  leaveRequest!: LeaveRequest;

  singleInvoice: any | undefined;

  leaveRequestId?: number;
  invoiceForm: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leaveService: LeaveRequestService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.leaveService
      .find(id)
      .subscribe((leaveRequest: any) => (this.leaveRequest = leaveRequest));

    console.log('id:', id);
  }

  public openPDF(leaveRequest: LeaveRequest): void {
    // On récupère les informations de la facture et on y ajoute l'identifiant
    const leaveRequestInvoice = { ...leaveRequest, id: this.leaveRequestId };

    let DATA: any = document.getElementById('test-export-pdf');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Facture_' + `${this.leaveRequest.type}` + '.pdf');
    });
  }

  public goBack() {
    this.router.navigate(['/leave-requests']);
  }

  // get total() {
  //   console.log('this.details.value', this.details.value);
  //   return this.details.value.reduce((itemTotal: number, item) => {
  //     return itemTotal + item.amount * item.quantity;
  //   }, 0);
  // }

  // get details() {
  //   return this.invoiceForm.controls.details;
  // }

  // get totalTVA() {
  //   return this.total * 0.2;
  // }

  // get totalTTC() {
  //   return this.total + this.totalTVA;
  // }

  public exportLeaveRequest() {
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
